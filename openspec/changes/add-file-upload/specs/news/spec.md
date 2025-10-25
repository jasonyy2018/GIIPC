# News Management Spec Deltas

## ADDED Requirements

### Requirement: File Upload Support
The system SHALL allow users with `write:news` permission to upload files when creating or editing news articles.

#### Scenario: Successful file upload
- **WHEN** user uploads a valid image file (jpg, png, gif) under 5MB
- **THEN** file is stored securely and associated with the news article
- **AND** file metadata is returned in API response

#### Scenario: File type validation
- **WHEN** user attempts to upload an unsupported file type
- **THEN** system rejects upload with clear error message
- **AND** no file is stored on the server

#### Scenario: File size limit enforcement
- **WHEN** user uploads a file exceeding size limits
- **THEN** system rejects upload before processing
- **AND** user receives specific error about size limit

### Requirement: File Management
The system SHALL provide secure access to uploaded files with proper authorization.

#### Scenario: Authorized file access
- **WHEN** authenticated user requests a file attached to published news
- **THEN** file is served with appropriate content headers
- **AND** access is logged for audit purposes

#### Scenario: Unauthorized file access
- **WHEN** unauthenticated user attempts to access uploaded file
- **THEN** system returns 401 Unauthorized
- **AND** no file content is served

### Requirement: File Cleanup
The system SHALL automatically manage file lifecycle and cleanup.

#### Scenario: News deletion cleanup
- **WHEN** news article is deleted
- **THEN** all associated files are removed from storage
- **AND** file metadata is removed from database

#### Scenario: Orphaned file detection
- **WHEN** system detects files without corresponding news records
- **THEN** files are flagged for cleanup after grace period
- **AND** cleanup actions are logged

## MODIFIED Requirements

### Requirement: News Creation API
The system SHALL accept news creation requests with optional file attachments and return complete news data including attachment metadata.

#### Scenario: Create news with attachments
- **WHEN** user with `write:news` permission creates news with files
- **THEN** news is created with file associations
- **AND** response includes attachment URLs and metadata
- **AND** files are accessible via secure endpoints

#### Scenario: Create news without attachments
- **WHEN** user creates news without files (existing behavior)
- **THEN** news is created normally
- **AND** attachments field is empty array in response