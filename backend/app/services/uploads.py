import os
import tempfile
import cloudinary
from cloudinary import uploader
import cloudinary.uploader
from fastapi import UploadFile, HTTPException, status
from moviepy import VideoFileClip
from .auth import settings

ALLOWED_MIME_TYPES = {
    "image/jpeg": "image",
    "image/jpg": "image",
    "image/png": "image",
    "video/mp4": "video",
    "video/quicktime": "video"
}

MAX_IMAGE_SIZE = 5 * 1024 * 1024
MAX_VIDEO_SIZE = 50 * 1024 * 1024
MAX_VIDEO_DURATION = 90.0


def validate_media_constraints(file: UploadFile) -> str:
    mime_type = file.content_type

    if mime_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported type {mime_type}. Only media of types '.mp4', '.mov', 'png', 'jpeg', 'jpg' are allowed"
        )
    

    media_class = ALLOWED_MIME_TYPES[mime_type]

    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)

    if media_class == "image" and file_size > MAX_IMAGE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
            detail=f"File too large, max size for images is {MAX_IMAGE_SIZE}"
        )

    if media_class == "video" and file_size > MAX_VIDEO_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
            detail=f"File too large, max size for videos is {MAX_VIDEO_SIZE}"
        )
    
    if media_class == "video":
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            try:
                file.file.seek(0)
                temp_file.write(file.file.read())
                temp_file.flush()

                with VideoFileClip(temp_file.name) as video:
                    duration = video.duration

                if duration > MAX_VIDEO_DURATION:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail=f"Video duration ({duration:.1f}s) exceeds the max video duration {MAX_VIDEO_DURATION}"
                    )
                
            finally:
                if os.path.exists(temp_file.name):
                    os.remove(temp_file.name)
        
        file.file.seek(0)

    try:
        if media_class == "video":
            upload_result = cloudinary.uploader.upload_large(
                file.file,
                resource_type="video",
                folder="naija_talent_zone/submissions"
            )
        else:
            upload_result = cloudinary.uploader.upload(
                file.file,
                resource_type="image",
                folder="naija_talent_zone/submissions"
            )

        secure_url = upload_result.get("secure_url")
        cloudinary_public_id = upload_result.get("public_id")

        return secure_url, cloudinary_public_id
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Media storage upload failed. Please try again."
        )