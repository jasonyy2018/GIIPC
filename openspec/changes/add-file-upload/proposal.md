# File Upload Feature Proposal

## Why
News articles currently only support text content. Users need to attach images, documents, and media files to make articles more engaging and informative.

## What Changes
- Add file upload endpoint with validation and security checks
- Support common file types: images (jpg, png, gif), documents (pdf), media (mp4)
- Implement file size limits (10MB per file, 50MB total per article)
- Add file management UI to news creation/editing forms
- Store file metadata in database with secure file paths
- **BREAKING**: News API responses will include new `attachments` field

## Impact
- Affected specs: news management
- Affected code: 
  - Backend: news controller, repository, validation
  - Frontend: news forms, file upload components
  - Database: new attachments table
  - Storage: new uploads directory with proper permissions