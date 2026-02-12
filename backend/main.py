"""
PDF to QR Code — FastAPI Backend
Handles PDF upload, generates QR code with download URL, serves files.
"""

import os
import uuid
import shutil
import socket
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import qrcode
import qrcode.constants
from io import BytesIO
import base64

# ──────────────────────────────────────────────
# App Setup
# ──────────────────────────────────────────────
app = FastAPI(title="PDF to QR Code API", version="1.0.0")

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Upload directory
UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Max file size: 10 MB
MAX_FILE_SIZE = 10 * 1024 * 1024

# In-memory store for uploaded files metadata
# { file_id: { "filename": str, "path": str } }
files_store: dict = {}


# ──────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────
@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "message": "PDF to QR Code API is running"}


@app.post("/api/upload")
async def upload_pdf(request: Request, file: UploadFile = File(...)):
    """
    Upload a PDF file and get back a QR code (base64 PNG).
    The QR code encodes a download URL for the uploaded PDF.
    """
    # Validate file type
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed. Please upload a .pdf file."
        )

    if file.content_type and file.content_type != "application/pdf":
        # Some browsers may not set content_type correctly, so we also check extension
        pass

    # Read file content
    content = await file.read()

    # Validate file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)} MB."
        )

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # Generate unique file ID
    file_id = str(uuid.uuid4())
    safe_filename = f"{file_id}.pdf"
    file_path = UPLOAD_DIR / safe_filename

    # Save file
    try:
        with open(file_path, "wb") as f:
            f.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    # Store metadata
    files_store[file_id] = {
        "filename": file.filename,
        "path": str(file_path),
        "size": len(content),
    }

    # Build download URL — use LAN IP so phones on the same network can reach it
    base_url = str(request.base_url).rstrip("/")
    try:
        local_ip = socket.gethostbyname(socket.gethostname())
    except Exception:
        local_ip = None
    if local_ip:
        base_url = base_url.replace("127.0.0.1", local_ip).replace("localhost", local_ip)
    download_url = f"{base_url}/api/files/{file_id}"

    # Generate QR code
    try:
        qr = qrcode.QRCode(
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(download_url)
        qr.make(fit=True)

        qr_img = qr.make_image(fill_color="#1a1a2e", back_color="#ffffff")

        # Convert to base64
        buffer = BytesIO()
        qr_img.save(buffer, format="PNG")
        buffer.seek(0)
        qr_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to generate QR code: {str(e)}"
        )

    return JSONResponse(
        status_code=200,
        content={
            "success": True,
            "file_id": file_id,
            "filename": file.filename,
            "file_size": len(content),
            "download_url": download_url,
            "qr_code": f"data:image/png;base64,{qr_base64}",
        },
    )


@app.get("/api/files/{file_id}")
async def download_file(file_id: str):
    """Download a previously uploaded PDF file by its ID."""
    if file_id not in files_store:
        raise HTTPException(status_code=404, detail="File not found or has expired.")

    meta = files_store[file_id]
    file_path = Path(meta["path"])

    if not file_path.exists():
        # Clean up stale entry
        del files_store[file_id]
        raise HTTPException(status_code=404, detail="File not found or has expired.")

    return FileResponse(
        path=str(file_path),
        filename=meta["filename"],
        media_type="application/pdf",
    )


@app.delete("/api/files/{file_id}")
async def delete_file(file_id: str):
    """Delete an uploaded PDF file."""
    if file_id not in files_store:
        raise HTTPException(status_code=404, detail="File not found.")

    meta = files_store[file_id]
    file_path = Path(meta["path"])

    try:
        if file_path.exists():
            file_path.unlink()
        del files_store[file_id]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete file: {str(e)}")

    return {"success": True, "message": "File deleted successfully."}


