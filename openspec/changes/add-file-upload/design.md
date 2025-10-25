# File Upload Design

## Context
Adding file upload capability to news articles requires careful consideration of security, performance, and storage. The system currently handles only text-based content.

## Goals / Non-Goals
- **Goals**: 
  - Secure file uploads with validation
  - Support common media types for news articles
  - Maintain performance with reasonable file size limits
  - Integrate seamlessly with existing news workflow
- **Non-Goals**: 
  - Advanced image editing or processing
  - Video streaming or transcoding
  - Cloud storage integration (local storage first)

## Decisions

### Storage Strategy
- **Decision**: Local file system storage with organized directory structure
- **Alternatives considered**: 
  - Cloud storage (AWS S3) - adds complexity and cost
  - Database BLOB storage - poor performance for large files
- **Rationale**: Keep it simple for initial implementation, easier to migrate later

### File Organization
- **Decision**: `/uploads/news/{news-id}/{timestamp}-{sanitized-filename}`
- **Security**: Prevent directory traversal, sanitize filenames
- **Cleanup**: Orphaned files cleaned up when news is deleted

### File Validation
- **Decision**: Whitelist approach with MIME type + extension validation
- **Supported types**: 
  - Images: jpg, jpeg, png, gif (max 5MB each)
  - Documents: pdf (max 10MB each)
  - Total limit: 50MB per news article

## Risks / Trade-offs
- **Disk space growth** → Implement cleanup policies and monitoring
- **Upload performance** → Add progress indicators and chunked uploads if needed
- **Security vulnerabilities** → Strict validation and sandboxed storage location

## Migration Plan
1. Deploy database schema changes
2. Deploy backend with upload endpoints (feature flagged)
3. Deploy frontend with upload UI
4. Enable feature flag after testing
5. **Rollback**: Disable uploads, remove UI components (files remain for manual cleanup)

## Open Questions
- Should we implement image resizing/thumbnails in v1?
- Do we need audit logging for file operations?
- What's the retention policy for uploaded files?