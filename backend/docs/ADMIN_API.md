# Admin API Documentation

This document describes the admin endpoints for user and role management.

## Authentication

All admin endpoints require:
1. Valid JWT token in the `Authorization` header
2. User must have the `admin` role

**Authorization Header Format:**
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Get All Users

Retrieve a list of all users in the system (without password information).

**Endpoint:** `GET /api/admin/users`

**Access:** Admin only

**Request:**
```http
GET /api/admin/users HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "admin@example.com",
      "role_id": 1,
      "role_name": "admin",
      "created_at": "2025-10-15T10:30:00.000Z",
      "updated_at": "2025-10-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "email": "editor@example.com",
      "role_id": 2,
      "role_name": "editor",
      "created_at": "2025-10-16T14:20:00.000Z",
      "updated_at": "2025-10-16T14:20:00.000Z"
    },
    {
      "id": 3,
      "email": "user@example.com",
      "role_id": 3,
      "role_name": "user",
      "created_at": "2025-10-17T09:15:00.000Z",
      "updated_at": "2025-10-17T09:15:00.000Z"
    }
  ],
  "count": 3
}
```

**Error Responses:**

**401 Unauthorized** - Missing or invalid JWT token:
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

**403 Forbidden** - User is not an admin:
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Access denied. Insufficient role privileges",
    "details": {
      "userRole": "user",
      "requiredRoles": ["admin"]
    }
  }
}
```

---

### 2. Update User Role

Change a user's role. Admins cannot change their own role.

**Endpoint:** `PUT /api/admin/users/:id/role`

**Access:** Admin only

**URL Parameters:**
- `id` (integer, required) - The ID of the user whose role should be updated

**Request Body:**
```json
{
  "roleId": 2
}
```

**Request Example:**
```http
PUT /api/admin/users/3/role HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "roleId": 2
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "id": 3,
    "email": "user@example.com",
    "role_id": 2,
    "role_name": "editor",
    "updated_at": "2025-10-17T10:45:00.000Z"
  }
}
```

**Error Responses:**

**400 Bad Request** - Invalid user ID:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_USER_ID",
    "message": "Invalid user ID"
  }
}
```

**400 Bad Request** - Invalid or missing role ID:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "roleId",
        "message": "Role ID is required"
      }
    ]
  }
}
```

**403 Forbidden** - Attempting to change own role:
```json
{
  "success": false,
  "error": {
    "code": "CANNOT_MODIFY_OWN_ROLE",
    "message": "You cannot modify your own role"
  }
}
```

**404 Not Found** - User not found:
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found"
  }
}
```

**404 Not Found** - Role not found:
```json
{
  "success": false,
  "error": {
    "code": "ROLE_NOT_FOUND",
    "message": "Role not found"
  }
}
```

---

### 3. Create New Role

Create a new role in the system.

**Endpoint:** `POST /api/admin/roles`

**Access:** Admin only

**Request Body:**
```json
{
  "name": "moderator",
  "description": "Can moderate content and manage users"
}
```

**Field Validation:**
- `name` (string, required): 2-50 characters, lowercase letters and underscores only
- `description` (string, optional): Role description

**Request Example:**
```http
POST /api/admin/roles HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "moderator",
  "description": "Can moderate content and manage users"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Role created successfully",
  "data": {
    "id": 4,
    "name": "moderator",
    "description": "Can moderate content and manage users",
    "created_at": "2025-10-17T11:00:00.000Z"
  }
}
```

**Error Responses:**

**400 Bad Request** - Invalid role name format:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "name",
        "message": "Role name must contain only lowercase letters and underscores"
      }
    ]
  }
}
```

**409 Conflict** - Role already exists:
```json
{
  "success": false,
  "error": {
    "code": "ROLE_ALREADY_EXISTS",
    "message": "Role 'moderator' already exists"
  }
}
```

---

### 4. Assign Permissions to Role

Assign one or more permissions to a role. This endpoint supports bulk assignment.

**Endpoint:** `POST /api/admin/roles/:id/permissions`

**Access:** Admin only

**URL Parameters:**
- `id` (integer, required) - The ID of the role to assign permissions to

**Request Body:**
```json
{
  "permissionIds": [1, 2, 3, 5, 8]
}
```

**Field Validation:**
- `permissionIds` (array of integers, required): At least one permission ID, all must be positive integers

**Request Example:**
```http
POST /api/admin/roles/4/permissions HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "permissionIds": [1, 2, 3, 5, 8]
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Permissions assigned successfully",
  "data": {
    "role": {
      "id": 4,
      "name": "moderator",
      "description": "Can moderate content and manage users"
    },
    "assignedCount": 5,
    "totalPermissions": 5,
    "permissions": [
      {
        "id": 1,
        "name": "read:news",
        "description": "Can read news articles"
      },
      {
        "id": 2,
        "name": "write:news",
        "description": "Can create news articles"
      },
      {
        "id": 3,
        "name": "edit:news",
        "description": "Can edit news articles"
      },
      {
        "id": 5,
        "name": "read:events",
        "description": "Can read events"
      },
      {
        "id": 8,
        "name": "write:events",
        "description": "Can create events"
      }
    ]
  }
}
```

**Error Responses:**

**400 Bad Request** - Invalid role ID:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_ROLE_ID",
    "message": "Invalid role ID"
  }
}
```

**400 Bad Request** - Invalid permission IDs:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "permissionIds",
        "message": "At least one permission ID is required"
      }
    ]
  }
}
```

**404 Not Found** - Role not found:
```json
{
  "success": false,
  "error": {
    "code": "ROLE_NOT_FOUND",
    "message": "Role not found"
  }
}
```

**404 Not Found** - One or more permissions not found:
```json
{
  "success": false,
  "error": {
    "code": "PERMISSIONS_NOT_FOUND",
    "message": "One or more permissions not found",
    "details": {
      "invalidPermissionIds": [99, 100]
    }
  }
}
```

**Note:** If a permission is already assigned to the role, it will be skipped (no duplicate assignments).

---

## Role IDs

The system has three predefined roles:

| Role ID | Role Name | Description |
|---------|-----------|-------------|
| 1 | admin | Full system access, can manage users and roles |
| 2 | editor | Can create and edit content (news, events, conferences) |
| 3 | user | Read-only access to public content |

---

## Usage Examples

### Example 1: Get All Users

```bash
curl -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Example 2: Promote User to Editor

```bash
curl -X PUT http://localhost:3000/api/admin/users/5/role \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"roleId": 2}'
```

### Example 3: Demote Editor to User

```bash
curl -X PUT http://localhost:3000/api/admin/users/5/role \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"roleId": 3}'
```

### Example 4: Create a New Role

```bash
curl -X POST http://localhost:3000/api/admin/roles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "moderator",
    "description": "Can moderate content and manage users"
  }'
```

### Example 5: Assign Permissions to a Role

```bash
curl -X POST http://localhost:3000/api/admin/roles/4/permissions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "permissionIds": [1, 2, 3, 5, 8]
  }'
```

### Example 6: Create Role and Assign Permissions (Combined)

```bash
# Step 1: Create the role
ROLE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/admin/roles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "content_manager",
    "description": "Manages all content types"
  }')

# Step 2: Extract role ID and assign permissions
ROLE_ID=$(echo $ROLE_RESPONSE | jq -r '.data.id')

curl -X POST http://localhost:3000/api/admin/roles/$ROLE_ID/permissions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "permissionIds": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  }'
```

---

## Security Notes

1. **Admin Role Required**: All endpoints require the user to have the `admin` role
2. **Self-Modification Prevention**: Admins cannot change their own role to prevent accidental lockout
3. **Role Validation**: The system validates that the target role exists before updating
4. **User Validation**: The system validates that the target user exists before updating
5. **Password Protection**: User passwords are never returned in API responses

---

## Testing

To test these endpoints, you need:

1. An admin user account
2. A valid JWT token from logging in as admin
3. The user ID you want to manage
4. The role ID you want to assign

**Step 1: Login as Admin**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

**Step 2: Use the returned token in subsequent requests**
```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer $TOKEN"
```
