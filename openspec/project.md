# Project Context

## Purpose
Global Innovation and Intellectual Property (GIIP) platform - a modern full-stack web application for managing news, events, conferences, and user roles with comprehensive authentication and authorization.

## Tech Stack
- **Backend**: Node.js v18+, Express v4.18+, PostgreSQL v16
- **Frontend**: Vanilla JavaScript, Tailwind CSS v3.4+, Font Awesome 6.4.0
- **Authentication**: JWT with RBAC (Role-Based Access Control)
- **Deployment**: Docker & Docker Compose, Nginx
- **Testing**: Jest, Supertest
- **Validation**: Zod
- **Security**: bcrypt, Helmet.js, rate limiting

## Project Conventions

### Code Style
- ES6+ syntax throughout
- 2 space indentation
- Conventional Commits format: `feat(auth): add JWT token refresh endpoint`
- Use camelCase for JavaScript variables and functions
- Use kebab-case for file names and URLs
- Use PascalCase for class names

### Architecture Patterns
- **Backend**: Layered architecture (routes → controllers → services → repositories)
- **API**: RESTful design with consistent JSON responses
- **Security**: JWT tokens (1 hour expiry), bcrypt hashing (10 salt rounds)
- **Database**: Parameterized queries to prevent SQL injection
- **Error Handling**: Centralized error middleware with structured responses
- **Caching**: Redis-compatible caching middleware

### Testing Strategy
- Unit tests for services and middleware
- Integration tests for API endpoints
- E2E tests for complete user workflows
- Performance testing with configurable load
- Security testing for common vulnerabilities
- Test coverage requirements for new features

### Git Workflow
- Feature branches from main: `feature/amazing-feature`
- Conventional commits with scope: `feat(auth):`, `fix(news):`, `docs(api):`
- Pull requests required for main branch
- Squash and merge preferred

## Domain Context
- **Users**: Three main roles - Admin (all permissions), Editor (read/write content), User (read-only)
- **Content Types**: News articles, Events, Conferences - each with CRUD operations
- **Permissions**: Granular RBAC with permissions like `write:news`, `delete:events`, `manage:users`
- **Authentication**: Email/password login with JWT tokens
- **Rate Limiting**: 5 login attempts per 15 minutes, 100 API requests per 15 minutes

## Important Constraints
- **Security First**: All endpoints require proper authentication/authorization
- **Performance**: API responses should be under 200ms for cached content
- **Accessibility**: Frontend must meet WCAG 2.1 AA standards
- **Docker**: All services must be containerized for consistent deployment
- **Database**: PostgreSQL only, no NoSQL dependencies
- **Minimal Dependencies**: Prefer vanilla JS over frameworks when possible

## External Dependencies
- **PostgreSQL**: Primary database (v16)
- **Redis**: Caching layer (optional but recommended)
- **Docker**: Container runtime
- **Nginx**: Reverse proxy and static file serving
- **Font Awesome**: Icon library (CDN)
- **Tailwind CSS**: Utility-first CSS framework (CDN)
