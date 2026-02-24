# ai_layer/images_api.py
import base64
import asyncio
from typing import List, Dict, Any

import httpx
from fastapi import APIRouter, Query

router = APIRouter(prefix="/images", tags=["Images"])

WIKI_API = "https://en.wikipedia.org/w/api.php"
HEADERS = {"User-Agent": "travel-planner-dev/1.0 (local testing)"}


async def _wiki_thumbnails(client: httpx.AsyncClient, query: str, limit: int) -> List[Dict[str, Any]]:
    params = {
        "action": "query",
        "format": "json",
        "prop": "pageimages",
        "generator": "search",
        "gsrsearch": query,
        "gsrlimit": limit,
        "piprop": "thumbnail",
        "pithumbsize": 640,
    }
    r = await client.get(WIKI_API, params=params)
    r.raise_for_status()
    data = r.json()

    pages = (data.get("query", {}).get("pages", {}) or {})
    results = []
    for _, p in pages.items():
        thumb = (p.get("thumbnail", {}) or {}).get("source")
        if thumb:
            results.append({"title": p.get("title", ""), "thumb_url": thumb})
    return results


async def _download_as_data_url(client: httpx.AsyncClient, url: str, sem: asyncio.Semaphore) -> str:
    async with sem:
        r = await client.get(url)
        r.raise_for_status()
        content_type = r.headers.get("content-type", "image/jpeg")
        b64 = base64.b64encode(r.content).decode("utf-8")
        return f"data:{content_type};base64,{b64}"


@router.get("/search")
async def search_images(
    q: str = Query(..., min_length=1),
    limit: int = Query(6, ge=1, le=12),
):
    """
    Wikipedia thumbnails -> base64 data URLs (inline images).
    Fast + stable: single client, parallel downloads with a small limit.
    """
    timeout = httpx.Timeout(connect=10.0, read=20.0, write=20.0, pool=20.0)

    async with httpx.AsyncClient(timeout=timeout, headers=HEADERS, follow_redirects=True) as client:
        thumbs = await _wiki_thumbnails(client, q, limit)

        if not thumbs:
            return {"query": q, "count": 0, "results": []}

        sem = asyncio.Semaphore(4)  # max 4 parallel downloads (avoid being blocked)
        tasks = []
        for item in thumbs:
            tasks.append(_download_as_data_url(client, item["thumb_url"], sem))

        data_urls = await asyncio.gather(*tasks, return_exceptions=True)

        results = []
        for item, data in zip(thumbs, data_urls):
            if isinstance(data, Exception):
                continue
            results.append({"title": item["title"], "data_url": data})

        return {"query": q, "count": len(results), "results": results}
