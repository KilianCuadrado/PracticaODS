import { getUserEvents, getUserOrgRequests, getUserById, updateUser } from '../api/usersApi.js';
import { showToast } from '../components/toast.js';
import { getSessionUser, setSessionUser } from '../utils/session.js';
import { hasMaxLength, hasMinLength, requiredFieldsFilled } from '../utils/validators.js';

const profileDataBox = document.getElementById('profileData');
const userEventsBox = document.getElementById('userEvents');
const userOrgRequestsBox = document.getElementById('userOrgRequests');
const profileForm = document.getElementById('profileForm');

/**
 * Inicializa la vista de perfil.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {Promise<void>}
 */
const initProfilePage = async () => {
  const currentUser = getSessionUser();
  if (!currentUser) {
    window.location.href = '/pages/login.html';
    return;
  }

  try {
    const [userData, userEvents, orgRequests] = await Promise.all([
      getUserById(currentUser.id),
      getUserEvents(currentUser.id),
      getUserOrgRequests(currentUser.id),
    ]);

    profileDataBox.innerHTML = `
      <p><strong>Usuario:</strong> ${userData.username}</p>
      <p><strong>Email:</strong> ${userData.email}</p>
      <p><strong>Rol actual:</strong> ${currentUser.role}</p>
      <p><strong>ORG asociada:</strong> ${userData.orgId || 'ninguna'}</p>
    `;

    userEventsBox.innerHTML = userEvents.length
      ? userEvents.map((eventItem) => `<li>${eventItem.title} (${eventItem.date})</li>`).join('')
      : '<li class="text-muted">No estás inscrito en eventos</li>';

    userOrgRequestsBox.innerHTML = orgRequests.length
      ? orgRequests
          .map((request) => `<li>ORG ${request.orgId} · estado: <strong>${request.status}</strong></li>`)
          .join('')
      : '<li class="text-muted">No tienes solicitudes de ORG</li>';
  } catch (error) {
    profileDataBox.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
};

document.addEventListener('DOMContentLoaded', initProfilePage);

/**
 * Gestiona el submit del perfil.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Event} event
 * @returns {Promise<void>}
 */
const handleProfileSubmit = async (event) => {
  event.preventDefault();
  const currentUser = getSessionUser();
  const username = document.getElementById('profileName').value;
  const password = document.getElementById('profilePassword').value;
  if (!requiredFieldsFilled([username])) {
    showToast({ message: 'El nombre es obligatorio', type: 'warning' });
    return;
  }
  if (!hasMinLength(username, 2) || !hasMaxLength(username, 40)) {
    showToast({ message: 'El nombre debe tener entre 2 y 40 caracteres', type: 'warning' });
    return;
  }
  if (password && !hasMinLength(password, 6)) {
    showToast({ message: 'La contraseña debe tener mínimo 6 caracteres', type: 'warning' });
    return;
  }

  try {
    const payload = { username };
    if (password) {
      payload.password = password;
    }
    const updatedUser = await updateUser(currentUser.id, payload);
    setSessionUser(Object.assign({}, currentUser, { username: updatedUser.username }));
    showToast({ message: 'Perfil actualizado', type: 'success', delay: 1200 });
    window.setTimeout(() => {
      window.location.reload();
    }, 900);
  } catch (error) {
    showToast({ message: error.message, type: 'error' });
  }
};

if (profileForm) {
  profileForm.addEventListener('submit', handleProfileSubmit);
}
