from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
import os

from app.core.database import get_db
from app.core.security import get_current_user
from app.services.google_drive_service import upload_file, file_id_to_view_link


router = APIRouter(
    prefix="/drive",
    tags=["GoogleDrive"],
    # Require login for every endpoint in this router
    dependencies=[Depends(get_current_user)],
)


@router.post("/upload")
async def upload(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # save to temp file then upload
    tmp_dir = os.getenv("TMP", "/tmp")
    local_path = os.path.join(tmp_dir, file.filename)
    with open(local_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # Upload using service account if provided via env
    credentials = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    try:
        meta = upload_file(local_path, credentials_json=credentials)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # return webViewLink if available or constructed link
    link = meta.get("webViewLink") or file_id_to_view_link(meta.get("id"))
    return {"id": meta.get("id"), "name": meta.get("name"), "link": link}
