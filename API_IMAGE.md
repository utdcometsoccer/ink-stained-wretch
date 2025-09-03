# Image API Documentation

This API allows users to upload images to Azure Blob Storage, retrieve a list of their uploaded images, and enforces file size and file count limits per user.

## Endpoints

### 1. Upload Image
- **POST** `/api/images/upload`
- **Description:** Upload an image file to Azure Blob Storage.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Body:**
  - `file`: image file (multipart/form-data)
- **Limits:**
  - Max file size: 5MB
  - Max files per user: 20
- **Responses:**
  - `201 Created`: Image uploaded successfully. Returns `{ id, url, name, size }`
  - `400 Bad Request`: File too large. Returns `{ error: "File size exceeds 5MB limit." }`
  - `403 Forbidden`: User has reached upload limit. Returns `{ error: "Maximum number of files (20) reached." }`
  - `401 Unauthorized`: Invalid or missing token.

### 2. List User Images
- **GET** `/api/images/user`
- **Description:** Get a list of all images uploaded by the authenticated user.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Responses:**
  - `200 OK`: Returns `[ { id, url, name, size, uploadedAt } ]`
  - `401 Unauthorized`: Invalid or missing token.

### 3. Delete Image
- **DELETE** `/api/images/{id}`
- **Description:** Delete an image by its ID.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Responses:**
  - `200 OK`: Image deleted successfully.
  - `404 Not Found`: Image not found.
  - `401 Unauthorized`: Invalid or missing token.

## Error Codes
- `400`: Bad Request (e.g., file too large)
- `401`: Unauthorized
- `403`: Forbidden (e.g., upload limit reached)
- `404`: Not Found

## Notes
- All endpoints require authentication.
- Images are stored in Azure Blob Storage and returned with public URLs.
- File size and file count limits are strictly enforced.
