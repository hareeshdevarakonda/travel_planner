import os, json, time, asyncio, base64
from threading import Lock
from typing import Any, Dict, List, Optional
import httpx
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field

from ai_layer.config import ITIN_STORAGE_DIR
from ai_layer.auth_api import get_current_user
from ai_layer.itinerary_service import generate_itinerary

router = APIRouter(prefix="/itineraries", tags=["Itineraries"])
lock = Lock()

WIKI_API = "https://en.wikipedia.org/w/api.php"
HEADERS = {"User-Agent":"travel-planner-dev/1.0"}

def _new_id(): return str(int(time.time()*1000))

def _user_file(uid: str) -> str:
    os.makedirs(ITIN_STORAGE_DIR, exist_ok=True)
    return os.path.join(ITIN_STORAGE_DIR, f"{uid}.json")

def _load(uid: str) -> List[Dict[str, Any]]:
    p = _user_file(uid)
    if not os.path.exists(p): return []
    return json.load(open(p,"r",encoding="utf-8"))

def _save(uid: str, rows: List[Dict[str, Any]]):
    p = _user_file(uid)
    json.dump(rows, open(p,"w",encoding="utf-8"), ensure_ascii=False, indent=2)

async def wiki_image(query: str) -> tuple[Optional[str], str]:
    """Fetch Wikipedia image and description for a place.
    Returns (image_data_url, description) tuple."""
    if not query or not query.strip():
        return None, ""
    
    timeout = httpx.Timeout(connect=5.0, read=10.0, write=10.0, pool=10.0)
    image_url_result = None
    description = ""
    
    try:
        async with httpx.AsyncClient(timeout=timeout, headers=HEADERS, follow_redirects=True) as client:
            clean_query = query.strip()
            
            print(f"[WIKI] Searching: '{clean_query}'")
            
            # Search for page
            search_resp = await client.get(WIKI_API, params={
                "action": "query",
                "format": "json",
                "list": "search",
                "srsearch": clean_query,
                "srlimit": 1,
            })
            search_resp.raise_for_status()
            search_results = search_resp.json().get("query", {}).get("search", [])
            
            if not search_results:
                print(f"[WIKI] No results for '{clean_query}'")
                return None, ""
            
            page_title = search_results[0].get("title", "")
            print(f"[WIKI] Found: '{page_title}'")
            
            # Get page details
            page_resp = await client.get(WIKI_API, params={
                "action": "query",
                "format": "json",
                "titles": page_title,
                "prop": "pageimages|extracts",
                "exintro": "true",
                "explaintext": "true",
                "exsentences": "10",
                "piprop": "thumbnail",
                "pithumbsize": "800",
            })
            page_resp.raise_for_status()
            pages = page_resp.json().get("query", {}).get("pages", {})
            
            if not pages:
                return None, ""
            
            page_data = next(iter(pages.values()))
            description = page_data.get("extract", "").strip()
            
            # Try to get image
            thumb = page_data.get("thumbnail")
            if thumb and "source" in thumb:
                img_src = thumb["source"]
                print(f"[WIKI] Image found: {img_src[:50]}...")
                
                try:
                    img_resp = await client.get(img_src)
                    img_resp.raise_for_status()
                    
                    content_type = img_resp.headers.get("content-type", "image/jpeg")
                    b64 = base64.b64encode(img_resp.content).decode("utf-8")
                    image_url_result = f"data:{content_type};base64,{b64}"
                    print(f"[WIKI] Image encoded successfully ({len(image_url_result)} bytes)")
                except Exception as e:
                    print(f"[WIKI] Failed to download image: {e}")
            else:
                print(f"[WIKI] No image thumbnail found")
            
            return image_url_result, description
            
    except asyncio.TimeoutError:
        print(f"[WIKI] Timeout for '{query}'")
        return None, ""
    except Exception as e:
        print(f"[WIKI] Error for '{query}': {type(e).__name__}: {e}")
        return None, ""

class ItineraryCreate(BaseModel):
    name: str = Field(..., min_length=1)   # treat as destination
    start_date: str
    end_date: str

@router.get("/")
def list_itineraries(user=Depends(get_current_user)):
    uid = user["id"]
    return _load(uid)

@router.get("/{itinerary_id}")
def get_itinerary(itinerary_id: str, user=Depends(get_current_user)):
    uid = user["id"]
    for t in _load(uid):
        if t["id"] == itinerary_id:
            return t
    raise HTTPException(404, "Itinerary not found")

@router.get("/{itinerary_id}/items")
def get_items(itinerary_id: str, user=Depends(get_current_user)):
    trip = get_itinerary(itinerary_id, user)
    return trip.get("items", [])

@router.delete("/{itinerary_id}/items/{item_id}")
def delete_item(itinerary_id: str, item_id: str, user=Depends(get_current_user)):
    """Delete an item from an itinerary"""
    uid = user["id"]
    rows = _load(uid)
    
    for itin in rows:
        if itin["id"] == itinerary_id:
            items = itin.get("items", [])
            itin["items"] = [it for it in items if it["id"] != item_id]
            with lock:
                _save(uid, rows)
            return {"message": "Item deleted successfully"}
    
    raise HTTPException(404, "Itinerary not found")

class TranslateRequest(BaseModel):
    target_language: str = Field(..., min_length=1)

@router.post("/{itinerary_id}/translate")
async def translate_itinerary(
    itinerary_id: str,
    req: TranslateRequest,
    user=Depends(get_current_user)
):
    """Translate itinerary items to target language using Groq LLM"""
    from ai_layer.llm_client import groq_chat
    import re
    
    uid = user["id"]
    rows = _load(uid)
    itin = None
    
    for t in rows:
        if t["id"] == itinerary_id:
            itin = t
            break
    
    if not itin:
        raise HTTPException(404, "Itinerary not found")
    
    target_lang = req.target_language.strip()
    print(f"[TRANSLATE] Translating itinerary {itinerary_id} to {target_lang}")
    
    # Translate each item
    translated_items = []
    for idx, item in enumerate(itin.get("items", [])):
        place_name = (item.get("place_name") or "").strip()
        note = (item.get("note") or "").strip()
        description = (item.get("description") or "").strip()
        
        if not any([place_name, note, description]):
            translated_items.append(item)
            continue
        
        # Create translation prompt
        prompt = f"""You are a professional translator. Translate the following travel itinerary content to {target_lang}.
Keep the JSON structure exactly as shown. Translate only the text values, not the keys.
Maintain all special characters and formatting.

Content to translate:
{{
  "place_name": "{place_name}",
  "note": "{note}",
  "description": "{description}"
}}

Return ONLY valid JSON with translated values. No additional text."""
        
        try:
            print(f"[TRANSLATE] Translating item {idx+1}/{len(itin.get('items', []))}...")
            messages = [{"role": "user", "content": prompt}]
            response = await groq_chat(messages, temperature=0.3)
            
            # Parse JSON response more carefully
            json_match = re.search(r'\{[^{}]*"place_name"[^{}]*\}', response, re.DOTALL)
            if not json_match:
                # Try broader search
                json_match = re.search(r'\{.*\}', response, re.DOTALL)
            
            if json_match:
                try:
                    translated = json.loads(json_match.group(0))
                    translated_item = item.copy()
                    translated_item["place_name"] = translated.get("place_name", place_name)
                    translated_item["note"] = translated.get("note", note)
                    translated_item["description"] = translated.get("description", description)
                    translated_items.append(translated_item)
                    print(f"[TRANSLATE] Item {idx+1} translated successfully")
                except json.JSONDecodeError as e:
                    print(f"[TRANSLATE] JSON parse error for item {idx+1}: {e}")
                    translated_items.append(item)
            else:
                print(f"[TRANSLATE] No JSON found in response for item {idx+1}")
                translated_items.append(item)
        except Exception as e:
            print(f"[TRANSLATE] Error translating item {idx+1}: {type(e).__name__}: {e}")
            translated_items.append(item)
    
    # Return translated itinerary
    translated_itin = itin.copy()
    translated_itin["items"] = translated_items
    translated_itin["language"] = target_lang
    
    print(f"[TRANSLATE] Translation complete for {itinerary_id}")
    return translated_itin

@router.post("/")
async def create_itinerary(payload: ItineraryCreate, user=Depends(get_current_user)):
    uid = user["id"]
    itin_id = _new_id()
    plan = await generate_itinerary(payload.name, payload.start_date, payload.end_date)

    # flatten items + fetch images and descriptions
    flat = []
    for d in plan.get("days", []):
        day_num = int(d.get("day", 1))
        for it in (d.get("items") or []):
            flat.append((day_num, it))

    print(f"[ITINERARY] Creating itinerary with {len(flat)} items")

    sem = asyncio.Semaphore(4)
    async def _wiki_fetch(q):
        async with sem:
            return await wiki_image(q)

    wiki_tasks = [_wiki_fetch((it.get("place_name") or it.get("headline") or payload.name)) for _,it in flat]
    wiki_results = await asyncio.gather(*wiki_tasks, return_exceptions=True)

    items = []
    for idx, (day_num, it) in enumerate(flat):
        place = (it.get("place_name") or "").strip()
        headline = (it.get("headline") or "").strip()
        desc = (it.get("description") or "").strip()
        
        # Get wiki image and description
        wiki_result = wiki_results[idx]
        img = None
        wiki_desc = ""
        
        if isinstance(wiki_result, Exception):
            print(f"[ITINERARY] Error for item {place}: {wiki_result}")
            img = None
            wiki_desc = desc
        elif wiki_result and isinstance(wiki_result, tuple) and len(wiki_result) == 2:
            img, wiki_desc = wiki_result
        else:
            wiki_desc = desc
        
        # Always add the item, even if no image (fallback to description)
        final_desc = wiki_desc if wiki_desc else desc
        
        print(f"[ITINERARY] Item: {place}, Image: {'Yes' if img else 'No'}, Desc length: {len(final_desc)}")
        
        items.append({
            "id": _new_id(),
            "day": day_num,
            "order": int(it.get("order", idx+1)),
            "note": headline or f"Visit {place}",
            "place_id": None,
            "place_name": place,
            "description": final_desc,
            "image_data_url": img,
        })

    itin = {
        "id": itin_id,
        "name": payload.name,
        "start_date": payload.start_date,
        "end_date": payload.end_date,
        "items": items,
        "co_travellers": [],
        "created_by": uid,
    }

    with lock:
        rows = _load(uid)
        rows.insert(0, itin)
        _save(uid, rows)

    print(f"[ITINERARY] Created itinerary {itin_id} with {len(items)} items")
    return itin