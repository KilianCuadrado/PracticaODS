import { registerUserApi } from '../api/authApi.js';
import { showToast } from '../components/toast.js';
import { hasMaxLength, hasMinLength, isValidEmail, requiredFieldsFilled } from '../utils/validators.js';

const registerUserForm = document.getElementById('registerUserForm');

/**
 * Gestiona el submit del registro de usuario.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Event} event
 * @returns {Promise<void>}
 */
const handleRegisterUserSubmit = async (event) => {
  event.preventDefault();
  const username = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerPasswordConfirm').value;

  if (!requiredFieldsFilled([username, email, password, confirmPassword])) {
    showToast({ message: 'Completa todos los campos', type: 'warning' });
    return;
  }
  if (!hasMinLength(username, 2) || !hasMaxLength(username, 40)) {
    showToast({ message: 'El nombre debe tener entre 2 y 40 caracteres', type: 'warning' });
    return;
  }
  if (!isValidEmail(email)) {
    showToast({ message: 'Email no válido', type: 'warning' });
    return;
  }
  if (!hasMinLength(password, 6)) {
    showToast({ message: 'La contraseña debe tener mínimo 6 caracteres', type: 'warning' });
    return;
  }
  if (password !== confirmPassword) {
    showToast({ message: 'Las contraseñas no coinciden', type: 'warning' });
    return;
  }

  try {
    await registerUserApi(username, email, password);
    showToast({ message: 'Registro correcto, ahora inicia sesión', type: 'success', delay: 1200 });
    window.setTimeout(() => {
      window.location.href = '/pages/login.html';
    }, 900);
  } catch (error) {
    showToast({ message: error.message, type: 'error' });
  }
};

if (registerUserForm) {
  registerUserForm.addEventListener('submit', handleRegisterUserSubmit);
}
