# ai_layer/maps_api.py
from fastapi import APIRouter, HTTPException
import httpx

router = APIRouter(prefix="/maps", tags=["Maps"])

@router.get("/ping")
def ping():
    return {"ok": True, "msg": "maps router is loaded"}

NOMINATIM_BASE = "https://nominatim.openstreetmap.org"
OSRM_BASE = "https://router.project-osrm.org"
HEADERS = {"User-Agent": "travel-planner-dev/1.0 (local testing)"}

async def geocode_place(q: str):
    params = {"q": q, "format": "jsonv2", "limit": 1}
    async with httpx.AsyncClient(timeout=30, headers=HEADERS) as client:
        r = await client.get(f"{NOMINATIM_BASE}/search", params=params)
        r.raise_for_status()
        data = r.json()
    if not data:
        raise HTTPException(status_code=404, detail=f"Place not found: {q}")
    lat = float(data[0]["lat"])
    lon = float(data[0]["lon"])
    name = data[0].get("display_name", q)
    return lat, lon, name

@router.get("/route")
async def route(source: str, destination: str):
    src_lat, src_lon, src_name = await geocode_place(source)
    dst_lat, dst_lon, dst_name = await geocode_place(destination)

    url = (
        f"{OSRM_BASE}/route/v1/driving/"
        f"{src_lon},{src_lat};{dst_lon},{dst_lat}"
        f"?overview=full&geometries=geojson&steps=true"
    )

    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.get(url)
        r.raise_for_status()
        data = r.json()

    if data.get("code") != "Ok" or not data.get("routes"):
        raise HTTPException(status_code=400, detail=f"OSRM error: {data}")

    route0 = data["routes"][0]
    return {
        "source": {"name": src_name, "lat": src_lat, "lon": src_lon},
        "destination": {"name": dst_name, "lat": dst_lat, "lon": dst_lon},
        "distance_m": route0["distance"],
        "duration_s": route0["duration"],
        "geometry": route0["geometry"],
        "legs": route0["legs"],
    }
