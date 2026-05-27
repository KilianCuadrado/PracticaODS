import { clearSessionUser, getSessionUser } from '../utils/session.js';

const guestLinks = [
  { href: '/', label: 'Inici' },
  { href: '/pages/ods.html', label: 'ODS 14/15' },
  { href: '/pages/reptes.html', label: 'Reptes' },
  { href: '/pages/practiques-sostenibles.html', label: 'Pràctiques' },
  { href: '/pages/economia-circular.html', label: 'Economia circular' },
  { href: '/pages/events.html', label: 'Events' },
  { href: '/pages/ongs.html', label: 'ONGs' },
  { href: '/pages/empresa-sostenible.html', label: 'Empresa sostenible' },
  { href: '/pages/register-ong.html', label: 'Crear ONG' },
];

const profileLink = { href: '/pages/profile.html', label: 'Perfil' };
const ongExtraLinks = [{ href: '/pages/ong-dashboard.html', label: 'Dashboard ONG' }];
const adminExtraLinks = [
  { href: '/pages/admin-users.html', label: 'Admin usuaris' },
  { href: '/pages/admin-ong-requests.html', label: 'Aprovació ONG' },
];

/**
 * Renderiza enlaces en el contenedor.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Array<{ href: string, label: string }>} links
 * @param {HTMLElement} container
 * @returns {void}
 */
const renderLinks = (links, container) => {
  container.innerHTML = links
    .map(
      (linkItem) => `
      <li class="nav-item">
        <a class="nav-link" href="${linkItem.href}">${linkItem.label}</a>
      </li>`,
    )
    .join('');
};

/**
 * Inicializa el navbar segun el usuario en sesion.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {void}
 */
window.initializeNavbar = () => {
  const linksContainer = document.getElementById('mainNavLinks');
  const authActions = document.getElementById('authNavActions');
  if (!linksContainer || !authActions) {
    return;
  }

  const currentUser = getSessionUser();
  let navLinks = guestLinks.slice();
  if (currentUser?.orgId || currentUser?.ownedOrgId) {
    navLinks = navLinks.filter((linkItem) => linkItem.href !== '/pages/register-ong.html');
  }
  if (currentUser) {
    navLinks = navLinks.concat(profileLink);
  }
  if (currentUser?.role === 'ong') {
    navLinks = navLinks.concat(ongExtraLinks);
  }
  if (currentUser?.role === 'admin') {
    navLinks = navLinks.concat(adminExtraLinks);
  }

  renderLinks(navLinks, linksContainer);

  if (!currentUser) {
    authActions.innerHTML = `
      <a class="btn btn-outline-primary" href="/pages/login.html">Login</a>
      <a class="btn btn-success" href="/pages/register-user.html">Registre</a>
    `;
    return;
  }

  authActions.innerHTML = `
    <span class="align-self-center small text-muted">Hola, ${currentUser.username}</span>
    <button type="button" class="btn btn-outline-danger" id="logoutButton">Sortir</button>
  `;
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      clearSessionUser();
      window.location.href = '/';
    });
  }
};
