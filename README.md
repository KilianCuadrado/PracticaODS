# PracticaODS

Proyecto web de sostenibilitat con eventos, orgs i recursos, front en public i backend en express

> [!WARNING] Lee estos bullet point para entender mas sobre el proyecto 
> - Base de Datos: JSON (`data/db.json`) 
> - Dependencias: Express, Body-Parser
> - Dependencias de desarrollo: nodemon
> - Consulta `package.json` para versiones exactas.

## Como correr

`npm run dev` i abre http://localhost:3000

## Web

Paginas principales, home en `/`, login en `/pages/login.html`, registro en `/pages/register-user.html`, eventos en `/pages/events.html`, orgs en `/pages/orgs.html`, admin en `/pages/admin-users.html`

## API

Todas las rutas responden JSON, se usan headers opcionales x-user-role, x-user-id, x-org-id

### Auth
- POST /api/auth/register-user, crea usuario
- POST /api/auth/register-org, crea org
- POST /api/auth/login, login

### Users
- GET /api/users, lista usuarios
- GET /api/users/:id, detalle usuario
- POST /api/users, crea usuario
- PUT /api/users/:id, actualiza usuario
- DELETE /api/users/:id, elimina usuario
- GET /api/users/:id/events, eventos del usuario
- GET /api/users/:id/org-requests, solicitudes de org

### Events
- GET /api/events, lista eventos, query opcional orgId
- GET /api/events/:id, detalle evento
- POST /api/events, crea evento
- PUT /api/events/:id, actualiza evento
- DELETE /api/events/:id, elimina evento
- POST /api/events/:id/join, une usuario al evento
- DELETE /api/events/:id/join/:userId, saca usuario del evento

### Orgs
- GET /api/orgs, lista orgs, query opcional status
- GET /api/orgs/:id, detalle org
- POST /api/orgs, crea org
- PUT /api/orgs/:id, actualiza org
- DELETE /api/orgs/:id, elimina org
- PATCH /api/orgs/:id/status, cambia estado de org
- POST /api/orgs/:id/join-requests, crea solicitud de union
- GET /api/orgs/:id/join-requests, lista solicitudes
- PATCH /api/orgs/:orgId/join-requests/:requestId, resuelve solicitud

### Resources
- GET /api/resources, lista recursos, query opcional type, status, category, q
- GET /api/resources/:id, detalle recurso
- POST /api/resources, crea recurso
- PUT /api/resources/:id, actualiza recurso
- DELETE /api/resources/:id, elimina recurso
