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
    setSessionUser(response.user);
    window.location.href = '/';
  } catch (error) {
    showToast({ message: error.message, type: 'error' });
  }
};

if (loginForm) {
  loginForm.addEventListener('submit', handleLoginSubmit);
}
