import httpx
from typing import List, Optional
from app.core.config import settings


BASE = settings.OPENTRIPMAP_API.rstrip("/") if settings.OPENTRIPMAP_API else "https://api.opentripmap.com"
KEY = settings.OPENTRIPMAP_KEY


async def geocode_city(city: str) -> Optional[dict]:
    """Return a dict with lat/lon for a city using OpenTripMap geoname endpoint."""
    if not KEY:
        return None

    url = f"{BASE}/0.1/en/places/geoname"
    params = {"name": city, "apikey": KEY}
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params)
        if resp.status_code != 200:
            return None
        return resp.json()


async def fetch_places_for_city(city: str, radius: int = 5000, limit: int = 20) -> List[dict]:
    """Fetch places near the city's centroid and return list of simplified place dicts.

    Each dict contains: name, lat, lon, description, media(list).
    """
    results = []
    if not KEY:
        return results

    geo = await geocode_city(city)
    if not geo or "lat" not in geo or "lon" not in geo:
        return results

    lat = geo.get("lat")
    lon = geo.get("lon")

    radius_url = f"{BASE}/0.1/en/places/radius"
    params = {"radius": radius, "lon": lon, "lat": lat, "limit": limit, "apikey": KEY}

    async with httpx.AsyncClient() as client:
        r = await client.get(radius_url, params=params)
        if r.status_code != 200:
            return results

        data = r.json()
        features = data.get("features") or []

        for feat in features:
            props = feat.get("properties") or {}
            xid = props.get("xid")
            name = props.get("name") or props.get("kinds")
            latp = feat.get("geometry", {}).get("coordinates", [None, None])
            lonp = None
            latv = None
            if latp and len(latp) >= 2:
                lonp, latv = latp[0], latp[1]

            detail = {}
            if xid:
                detail_url = f"{BASE}/0.1/en/places/xid/{xid}"
                dr = await client.get(detail_url, params={"apikey": KEY})
                if dr.status_code == 200:
                    detail = dr.json()

            description = None
            media = []
            if detail:
                description = detail.get("wikipedia_extracts", {}).get("text") or detail.get("info", {}).get("descr")
                preview = detail.get("preview") or {}
                if preview.get("source"):
                    media.append(preview.get("source"))

            results.append({
                "name": name,
                "lat": latv,
                "lon": lonp,
                "description": description,
                "media": media,
            })

    return results
