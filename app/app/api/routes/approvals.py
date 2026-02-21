import json

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.approval_request import ApprovalRequest
from app.models.place import Place
from app.models.place_media import PlaceMedia
from app.core.security import get_current_admin, get_current_user


router = APIRouter(
    prefix="/approvals",
    tags=["Approvals"],
    # Require login for every endpoint in this router
    dependencies=[Depends(get_current_user)],
)


@router.post("/submit")
def submit_request(payload: dict, db: Session = Depends(get_db)):
    # payload must contain at least 'type' and 'data' (data will be stored as JSON string)
    rtype = payload.get("type")
    data = payload.get("data")
    if not rtype or data is None:
        raise HTTPException(status_code=400, detail="Missing type or data")

    req = ApprovalRequest(type=rtype, data=json.dumps(data), status="PENDING")
    db.add(req)
    db.commit()
    db.refresh(req)
    return {"id": req.id, "status": req.status}


@router.get("/")
def list_requests(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return db.query(ApprovalRequest).order_by(ApprovalRequest.id.desc()).all()


@router.post("/{req_id}/approve")
def approve_request(req_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    req = db.get(ApprovalRequest, req_id)
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    if req.status != "PENDING":
        raise HTTPException(status_code=400, detail="Request already processed")

    # try to apply the change depending on type
    data = {}
    try:
        data = json.loads(req.data)
    except Exception:
        pass

    if req.type == "place_create":
        # expected data: {name, description, latitude, longitude, city_id, media: [url,...]}
        place = Place(
            name=data.get("name"),
            description=data.get("description"),
            latitude=data.get("latitude"),
            longitude=data.get("longitude"),
            city_id=data.get("city_id")
        )
        db.add(place)
        db.commit()
        db.refresh(place)

        media = data.get("media") or []
        for url in media:
            pm = PlaceMedia(url=url, place_id=place.id)
            db.add(pm)

        db.commit()

    # mark request approved
    req.status = "APPROVED"
    db.add(req)
    db.commit()

    return {"id": req.id, "status": req.status}


@router.post("/{req_id}/reject")
def reject_request(req_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    req = db.get(ApprovalRequest, req_id)
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    if req.status != "PENDING":
        raise HTTPException(status_code=400, detail="Request already processed")

    req.status = "REJECTED"
    db.add(req)
    db.commit()

    return {"id": req.id, "status": req.status}
