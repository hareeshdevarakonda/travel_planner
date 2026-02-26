from fastapi import APIRouter, HTTPException
import httpx

router = APIRouter(prefix="/maps", tags=["Maps"])

NOMINATIM_BASE = "https://nominatim.openstreetmap.org"
OSRM_BASE = "https://router.project-osrm.org"
HEADERS = {"User-Agent": "travel-planner-dev/1.0"}

@router.get("/ping")
def ping():
    return {"ok": True}

async def geocode(q: str):
    params = {"q": q, "format": "jsonv2", "limit": 1}
    async with httpx.AsyncClient(timeout=30, headers=HEADERS) as client:
        r = await client.get(f"{NOMINATIM_BASE}/search", params=params)
        r.raise_for_status()
        data = r.json()
    if not data:
        raise HTTPException(status_code=404, detail=f"Place not found: {q}")
    return float(data[0]["lat"]), float(data[0]["lon"]), data[0].get("display_name", q)

@router.get("/route")
async def route(source: str, destination: str):
    s_lat, s_lon, s_name = await geocode(source)
    d_lat, d_lon, d_name = await geocode(destination)

    url = f"{OSRM_BASE}/route/v1/driving/{s_lon},{s_lat};{d_lon},{d_lat}?overview=full&geometries=geojson&steps=true"

    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.get(url)
        r.raise_for_status()
        data = r.json()

    if data.get("code") != "Ok" or not data.get("routes"):
        raise HTTPException(status_code=400, detail=f"OSRM error: {data}")

    route0 = data["routes"][0]
    return {
        "source": {"name": s_name, "lat": s_lat, "lon": s_lon},
        "destination": {"name": d_name, "lat": d_lat, "lon": d_lon},
        "distance_m": route0["distance"],
        "duration_s": route0["duration"],
        "geometry": route0["geometry"],
        "legs": route0["legs"],
    }