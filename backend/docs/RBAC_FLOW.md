# RBAC 权限系统流程图

## 认证流程

```mermaid
sequenceDiagram
    participant Client
    participant authGuard
    participant JWT
    participant Handler
    
    Client->>authGuard: Request + Authorization Header
    authGuard->>authGuard: Extract Token
    
    alt No Token
        authGuard-->>Client: 401 NO_TOKEN
    else Invalid Format
        authGuard-->>Client: 401 INVALID_TOKEN_FORMAT
    else Valid Token
        authGuard->>JWT: Verify Token
        
        alt Token Expired
            JWT-->>authGuard: TokenExpiredError
            authGuard-->>Client: 401 TOKEN_EXPIRED
        else Invalid Token
            JWT-->>authGuard: JsonWebTokenError
            authGuard-->>Client: 401 INVALID_TOKEN
        else Valid
            JWT-->>authGuard: Decoded Payload
            authGuard->>authGuard: Set req.user
            authGuard->>Handler: next()
            Handler-->>Client: Response
        end
    end
```

## 权限验证流程

```mermaid
sequenceDiagram
    participant Client
    participant authGuard
    participant permissionGuard
    participant RoleService
    participant Cache
    participant Database
    participant Handler
    
    Client->>authGuard: Request + Token
    authGuard->>authGuard: Verify & Set req.user
    authGuard->>permissionGuard: next()
    
    permissionGuard->>permissionGuard: Check req.user exists
    
    alt No User
        permissionGuard-->>Client: 401 UNAUTHORIZED
    else User Exists
        permissionGuard->>RoleService: checkPermission(roleId, permission)
        
        RoleService->>Cache: Check Cache
        
        alt Cache Hit
            Cache-->>RoleService: Cached Permissions
        else Cache Miss
            RoleService->>Database: Query Permissions
            Database-->>RoleService: Permission List
            RoleService->>Cache: Update Cache
        end
        
        RoleService->>RoleService: Verify Permission
        
        alt Has Permission
            RoleService-->>permissionGuard: true
            permissionGuard->>Handler: next()
            Handler-->>Client: Response
        else No Permission
            RoleService-->>permissionGuard: false
            permissionGuard-->>Client: 403 FORBIDDEN
        end
    end
```

## 完整请求流程

```mermaid
flowchart TD
    A[Client Request] --> B{Has Auth Header?}
    B -->|No| C[401 NO_TOKEN]
    B -->|Yes| D[Extract Token]
    
    D --> E{Valid Format?}
    E -->|No| F[401 INVALID_FORMAT]
    E -->|Yes| G[Verify JWT]
    
    G --> H{Token Valid?}
    H -->|Expired| I[401 TOKEN_EXPIRED]
    H -->|Invalid| J[401 INVALID_TOKEN]
    H -->|Valid| K[Set req.user]
    
    K --> L{Permission Check?}
    L -->|No| M[Execute Handler]
    L -->|Yes| N[Check Cache]
    
    N --> O{Cache Hit?}
    O -->|Yes| P[Get Cached Permissions]
    O -->|No| Q[Query Database]
    
    Q --> R[Update Cache]
    R --> P
    
    P --> S{Has Permission?}
    S -->|No| T[403 FORBIDDEN]
    S -->|Yes| M
    
    M --> U[Return Response]
```

## 缓存机制

```mermaid
flowchart LR
    A[Permission Request] --> B{Cache Valid?}
    B -->|Yes| C[Return Cached Data]
    B -->|No| D[Query Database]
    D --> E[Store in Cache]
    E --> F[Set Timestamp]
    F --> C
    
    G[5 Minutes Later] --> H[Cache Expires]
    H --> B
```

## 数据库关系

```mermaid
erDiagram
    USERS ||--|| ROLES : has
    ROLES ||--o{ ROLE_PERMISSIONS : has
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : belongs_to
    
    USERS {
        int id PK
        string email
        string password
        int role_id FK
    }
    
    ROLES {
        int id PK
        string name
        string description
    }
    
    PERMISSIONS {
        int id PK
        string name
        string description
    }
    
    ROLE_PERMISSIONS {
        int role_id FK
        int permission_id FK
    }
```

## 中间件链

```mermaid
flowchart LR
    A[Request] --> B[authGuard]
    B --> C{Authenticated?}
    C -->|No| D[401 Error]
    C -->|Yes| E[permissionGuard]
    E --> F{Has Permission?}
    F -->|No| G[403 Error]
    F -->|Yes| H[Route Handler]
    H --> I[Response]
```

## 角色权限映射

```mermaid
graph TD
    A[Admin Role] --> B[read:news]
    A --> C[write:news]
    A --> D[edit:news]
    A --> E[delete:news]
    A --> F[manage:users]
    A --> G[manage:roles]
    
    H[Editor Role] --> B
    H --> C
    H --> D
    
    I[User Role] --> B
```

## 使用场景示例

### 场景 1: 公开访问
```mermaid
sequenceDiagram
    Client->>API: GET /api/news/public
    API->>Handler: Direct Access
    Handler-->>Client: News Data
```

### 场景 2: 需要认证
```mermaid
sequenceDiagram
    Client->>API: GET /api/profile + Token
    API->>authGuard: Verify Token
    authGuard->>Handler: Authenticated
    Handler-->>Client: Profile Data
```

### 场景 3: 需要权限
```mermaid
sequenceDiagram
    Client->>API: POST /api/news + Token
    API->>authGuard: Verify Token
    authGuard->>permissionGuard: Check write:news
    permissionGuard->>RoleService: Query Permission
    RoleService-->>permissionGuard: Has Permission
    permissionGuard->>Handler: Authorized
    Handler-->>Client: News Created
```

### 场景 4: 权限不足
```mermaid
sequenceDiagram
    Client->>API: DELETE /api/news/1 + Token
    API->>authGuard: Verify Token
    authGuard->>permissionGuard: Check delete:news
    permissionGuard->>RoleService: Query Permission
    RoleService-->>permissionGuard: No Permission
    permissionGuard-->>Client: 403 FORBIDDEN
```

## 错误处理流程

```mermaid
flowchart TD
    A[Error Occurs] --> B{Error Type?}
    
    B -->|No Token| C[401 NO_TOKEN]
    B -->|Invalid Format| D[401 INVALID_FORMAT]
    B -->|Token Expired| E[401 TOKEN_EXPIRED]
    B -->|Invalid Token| F[401 INVALID_TOKEN]
    B -->|No Permission| G[403 FORBIDDEN]
    B -->|Server Error| H[500 INTERNAL_ERROR]
    
    C --> I[JSON Response]
    D --> I
    E --> I
    F --> I
    G --> I
    H --> I
    
    I --> J[Client Receives Error]
```

## 性能优化

```mermaid
flowchart LR
    A[First Request] --> B[Query DB]
    B --> C[Cache Result]
    C --> D[Return Data]
    
    E[Subsequent Requests] --> F{Cache Valid?}
    F -->|Yes| G[Return Cached]
    F -->|No| B
    
    H[5 Min TTL] --> I[Cache Expires]
    I --> F
```

## 总结

这些流程图展示了:
1. **认证流程**: JWT token 验证和错误处理
2. **权限验证**: 缓存机制和数据库查询
3. **完整流程**: 从请求到响应的完整路径
4. **缓存机制**: 性能优化策略
5. **数据库关系**: RBAC 数据模型
6. **使用场景**: 不同访问级别的实际应用
7. **错误处理**: 各种错误情况的处理流程
