import { loginUser } from '../api/authApi.js';
import { showToast } from '../components/toast.js';
import { setSessionUser } from '../utils/session.js';
import { isValidEmail, requiredFieldsFilled } from '../utils/validators.js';

const loginForm = document.getElementById('loginForm');

/**
 * Gestiona el submit del login.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Event} event
 * @returns {Promise<void>}
 */
const handleLoginSubmit = async (event) => {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  if (!requiredFieldsFilled([email, password])) {
    showToast({ message: 'Completa todos los campos', type: 'warning' });
    return;
  }
  if (!isValidEmail(email)) {
    showToast({ message: 'Email no válido', type: 'warning' });
    return;
  }

  try {
    const response = await loginUser(email, password);
    setSessionUser({
      id: response.user.id,
      username: response.user.username,
      email: response.user.email,
      role: response.user.role,
      baseRole: response.user.baseRole,
      orgId: response.user.orgId,
      ownedOrgId: response.user.ownedOrgId,
      ownedOrgStatus: response.user.ownedOrgStatus,
      token: response.token,
    });
    window.location.href = '/';
  } catch (error) {
    showToast({ message: error.message, type: 'error' });
  }
};

if (loginForm) {
  loginForm.addEventListener('submit', handleLoginSubmit);
}
