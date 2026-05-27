import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerAuthRoutes } from './routes/auth.js';
import { registerEventRoutes } from './routes/events.js';
import { registerOngRoutes } from './routes/ongs.js';
import { registerResourceRoutes } from './routes/resources.js';
import { registerUserRoutes } from './routes/users.js';

/**
 * Crea y configura la app de express.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Parseamos JSON en el body de las peticiones.
app.use(express.json());

// ---- Rutas de páginas ----
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'home.html'));
});

app.get('/landing_page.html', (req, res) => res.redirect('/'));
app.get('/login.html', (req, res) => res.redirect('/pages/login.html'));
app.get('/register.html', (req, res) => res.redirect('/pages/register-user.html'));
app.get('/events.html', (req, res) => res.redirect('/pages/events.html'));
app.get('/orgs.html', (req, res) => res.redirect('/pages/ongs.html'));
app.get('/ongs.html', (req, res) => res.redirect('/pages/ongs.html'));
app.get('/pages/ongs.html', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'orgs.html')));
app.get('/pages/register-ong.html', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'register-org.html')));
app.get('/pages/ong-dashboard.html', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'org-dashboard.html')));
app.get('/pages/admin-ong-requests.html', (req, res) =>
  res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'admin-org-requests.html')),
);
app.get('/admin.html', (req, res) => res.redirect('/pages/admin-users.html'));

// Archivos estáticos del front.
app.use(express.static(path.join(__dirname, '..', 'public')));

// ---- API separada por archivos (MVC) ----
registerAuthRoutes(app);
registerUserRoutes(app);
registerEventRoutes(app);
registerOngRoutes(app);
registerResourceRoutes(app);

export default app;
