# Brainstorming projecte ODS (14 + 15)

## 1) ODS escollits
- **ODS 14:** Vida submarina.
- **ODS 15:** Vida d'ecosistemes terrestres.

## 2) Visió de la web
La web ha de transmetre **protecció, restauració i acció col·lectiva**.  
No serà només una web "blava/verd": cada component visual (colors, icones, transicions, feedback i jerarquia) ha d'estar pensat per reforçar el missatge de sostenibilitat.

Objectius UX principals:
1. Navegació molt clara (navbar funcional a totes les pàgines).
2. Contingut educatiu + funcionalitat real (CRUD i fluxos d'usuaris/ORG/admin).
3. Interfície atractiva però lleugera (evitar excés d'efectes i peticions innecessàries).

## 3) Sistema visual (colors, motiu i ús)

### 3.1 Paleta principal
| Color | Hex | Motiu | Assignació principal | Pàgines/components |
|---|---|---|---|---|
| Blau oceà | `#0077BE` | Representa mar, confiança i estabilitat | Botons primaris, links actius, highlights ODS14 | Home, Events, Detall Event |
| Verd bosc | `#2E7D32` | Representa biodiversitat terrestre, recuperació i creixement | Badges ODS15, botons secundaris, seccions educatives | ODS, Economia circular, Retes |
| Turquesa | `#00A896` | Pont visual entre mar i terra | Gràfics, icones de dades, elements informatius | Dashboard ORG/Admin |
| Sorra clara | `#F1E9DA` | Evoca costa i terreny natural; base neta i càlida | Fons de targetes i blocs de text | Global (cards i formularis) |
| Blanc trencat | `#FAFAF7` | Millora llegibilitat i respiració visual | Fons general de pàgina | Global |
| Gris pissarra | `#2F3E46` | Contrast de text accessible | Text principal i títols secundaris | Global |
| Corall alerta | `#E76F51` | Accions destructives / errors | Botó eliminar, alertes d'error, validacions | CRUD Admin/ORG |
| Ambre estat | `#F4A261` | Estat pendent de validació | Badges "pendent", avisos moderats | Registre ORG / aprovació ORG |

### 3.2 Regles d'ús
1. **Primari = blau oceà** (CTA principals).
2. **Secundari = verd bosc** (accions de suport o seccions ODS15).
3. **Accions destructives sempre en corall** i amb confirmació.
4. Màxim **2 colors d'accent** visibles alhora per pantalla.
5. Contrast mínim AA (text sobre fons clars/obscurs).

### 3.3 Tipografia i to visual
- Font recomanada: `Inter` o `Poppins` (fallback sans-serif).
- Titulars: pes 600/700; text base: 400/500.
- Cantonades suaus (`8px`-`12px`) i ombres lleugeres per cartes/formularis.

### 3.4 Animacions i microinteraccions
- Hover en botons i cards (`transition: 180ms ease`).
- Aparició suau de missatges de validació/feedback.
- Barres de progrés només en dashboards o mètriques d'impacte (no decoratives).

## 4) Arquitectura d'informació i navegació

### 4.1 Navbar global (mínim)
- Inici
- ODS 14/15
- Reptes i solucions
- Economia circular
- Events
- Organitzacions
- Empresa sostenible (RA6)
- Login / Registre
- Perfil (quan hi ha sessió)
- Admin (només rol admin)

### 4.2 Mapa de pàgines objectiu (>=10)
| Ruta | Pàgina | Rol | Objectiu |
|---|---|---|---|
| `/` | Home / Landing | Guest/User/ORG/Admin | Presentació projecte i CTA principals |
| `/ods` | ODS 14 + 15 | Tots | Explicar ODS escollits i impacte ASG |
| `/reptes` | Reptes i solucions (RA2) | Tots | Problema real + com la plataforma ajuda |
| `/practiques-sostenibles` | Pràctiques sostenibles (RA3) | Tots | Bones pràctiques del desenvolupament del projecte |
| `/economia-circular` | Model de servei circular (RA4) | Tots | Explicar com el CRUD allarga vida útil/evita consum |
| `/empresa-sostenible` | Anàlisi empresa real (RA6) | Tots | Resum d'informe de sostenibilitat d'una empresa tech |
| `/events` | Catàleg d'events | Tots | Llistar events i filtres |
| `/events/:id` | Detall event | Tots | Veure detall i unir-se a l'event |
| `/orgs` | Catàleg d'ORG | Tots | Llistar organitzacions i informació |
| `/login` | Login | Guest | Iniciar sessió |
| `/register-user` | Registre usuari | Guest | Crear compte usuari normal |
| `/register-org` | Registre ORG | Guest | Enviar sol·licitud d'alta ORG |
| `/profile` | Perfil usuari | User | Dades, org associada, events inscrits |
| `/org-dashboard` | Dashboard ORG | ORG | CRUD dels seus events i gestió de sol·licituds |
| `/admin/users` | Admin usuaris | Admin | CRUD complet d'usuaris |
| `/admin/org-requests` | Admin aprovació ORG | Admin | Aprovar/rebutjar registres ORG |

## 5) Vistes, includes i components (estat actual)

### 5.1 Includes/layout reutilitzables
- `public/includes/navbar.html`
- `public/includes/footer.html`
- Càrrega dinàmica d'includes amb `public/js/components/includeLoader.js`

### 5.2 Components clau implementats
- Navbar dinàmica per rol (`guest`, `user`, `org`, `admin`) amb `public/js/components/navbar.js`
- Sistema de notificacions amb toasts (`public/js/components/toast.js`)
- Reutilització de cards, taules i formularis amb estils compartits (`public/styles/*.css`)

### 5.3 Formularis operatius
1. Login.
2. Registre usuari.
3. Registre ORG (sol·licitud pendent d'aprovació).
4. Crear/editar events (ORG).
5. Edició de perfil.
6. CRUD d'usuaris (admin).

## 6) Estructura actual de carpetes (implementada)

```txt
sostenibilitat-proyecte/
├── backend/
│   ├── app.js
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   └── utils/
├── data/
│   └── db.json
├── public/
│   ├── includes/
│   ├── js/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│   ├── pages/
│   └── styles/
├── docs/
├── index.js
└── package.json
```

## 7) Estat funcional actual (MVP)
| Funcionalitat | Estat actual | Pàgina/mòdul |
|---|---|---|
| Registre usuaris normals | Fet | `register-user.html` + `/api/auth/register-user` |
| Login usuaris | Fet | `login.html` + `/api/auth/login` |
| CRUD admin d'usuaris | Fet | `admin-users.html` + `/api/users` |
| Registre ORG pendent validació | Fet | `register-org.html` + `/api/auth/register-org` |
| Acceptar/rebutjar ORG (admin) | Fet | `admin-org-requests.html` + `/api/orgs/:id/status` |
| CRUD events per ORG propietària | Fet | `org-dashboard.html` + `/api/events` |
| Usuari s'uneix a events | Fet | `events.html`, `event-detail.html` + `/api/events/:id/join` |
| Usuari sol·licita unió a ORG | Fet | `orgs.html` + `/api/orgs/:id/join-requests` |
| Resolució de sol·licituds d'unió (ORG/Admin) | Fet | `org-dashboard.html` + `/api/orgs/:orgId/join-requests/:requestId` |

## 8) Criteris tècnics obligatoris (estat de compliment)
1. Front-end amb HTML5, CSS i JS: **complert**.
2. 10+ pàgines connectades per navbar: **complert**.
3. Validacions client en formularis crítics: **complert**.
4. API REST amb CRUD (`GET`, `POST`, `PUT`, `DELETE`) sobre `db.json`: **complert**.
5. Consum asíncron amb `fetch` + `async/await`: **complert**.
6. UI/UX coherent amb ODS 14 + 15: **complert**.

## 9) Checklist final de compliment
- [x] Sistema visual aplicat (paleta, jerarquia i components).
- [x] 10+ pàgines connectades per navbar.
- [x] Includes/components reutilitzables.
- [x] CRUD complet en API.
- [x] Validacions client en formularis crítics.
- [x] Fluxos per rols operatius (guest, user, ORG, admin).
- [x] Contingut ODS/ASG/RA2-RA6 publicat i integrat.
- [x] Estructura de projecte ordenada i funcional.
