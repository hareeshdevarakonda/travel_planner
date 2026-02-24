"""Google Drive helpers with optional service account support.

This module provides functions to build a Drive service from a service
account JSON, upload files, list files in a folder, download files and
produce view links. If the google libraries are not installed or no
credentials are provided, some helpers will return safe fallbacks.
"""

from typing import Optional, List
import io
import os
import mimetypes

try:
	from google.oauth2.service_account import Credentials
	from googleapiclient.discovery import build
	from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload
	GOOGLE_AVAILABLE = True
except Exception:
	# Libraries not installed
	GOOGLE_AVAILABLE = False


SCOPES = [
	"https://www.googleapis.com/auth/drive",
	"https://www.googleapis.com/auth/drive.file",
]


def _build_service(credentials_json: Optional[str] = None):
	if not GOOGLE_AVAILABLE:
		return None

	creds = None
	if credentials_json and os.path.exists(credentials_json):
		creds = Credentials.from_service_account_file(credentials_json, scopes=SCOPES)
	else:
		# Attempt to use environment variable GOOGLE_APPLICATION_CREDENTIALS
		env_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
		if env_path and os.path.exists(env_path):
			creds = Credentials.from_service_account_file(env_path, scopes=SCOPES)

	if creds is None:
		return None

	service = build("drive", "v3", credentials=creds)
	return service


def file_id_to_view_link(file_id: str) -> str:
	return f"https://drive.google.com/uc?export=view&id={file_id}"


def upload_file(path: str, credentials_json: Optional[str] = None, folder_id: Optional[str] = None) -> dict:
	"""Upload a local file to Google Drive and return the created file metadata.

	Requires a service account JSON via `credentials_json` or env var
	`GOOGLE_APPLICATION_CREDENTIALS`.
	"""
	service = _build_service(credentials_json)
	if service is None:
		raise RuntimeError("Google Drive libraries or credentials not available")

	filename = os.path.basename(path)
	mimetype, _ = mimetypes.guess_type(path)
	media = MediaFileUpload(path, mimetype=mimetype or "application/octet-stream")
	body = {"name": filename}
	if folder_id:
		body["parents"] = [folder_id]

	file = service.files().create(body=body, media_body=media, fields="id,name,mimeType,webViewLink").execute()
	return file


def list_folder_files(folder_id: str, credentials_json: Optional[str] = None) -> List[dict]:
	service = _build_service(credentials_json)
	if service is None:
		return []

	query = f"'{folder_id}' in parents and trashed = false"
	resp = service.files().list(q=query, fields="files(id,name,mimeType,webViewLink)").execute()
	return resp.get("files", [])


def get_file_metadata(file_id: str, credentials_json: Optional[str] = None) -> dict:
	service = _build_service(credentials_json)
	if service is None:
		return {"id": file_id, "webViewLink": file_id_to_view_link(file_id)}

	file = service.files().get(fileId=file_id, fields="id,name,mimeType,webViewLink,webContentLink").execute()
	return file


def download_file(file_id: str, dest_path: str, credentials_json: Optional[str] = None) -> None:
	service = _build_service(credentials_json)
	if service is None:
		raise RuntimeError("Google Drive libraries or credentials not available")

	request = service.files().get_media(fileId=file_id)
	fh = io.FileIO(dest_path, "wb")
	downloader = MediaIoBaseDownload(fh, request)
	done = False
	while not done:
		status, done = downloader.next_chunk()

	return

