import { registerOngApi } from '../api/authApi.js';
import { showToast } from '../components/toast.js';
import { getSessionUser } from '../utils/session.js';
import {
  hasMaxLength,
  hasMinLength,
  isValidEmail,
  isValidUrl,
  requiredFieldsFilled,
} from '../utils/validators.js';

const registerOrgForm = document.getElementById('registerOrgForm');

/**
 * Gestiona el submit del registro de ONG.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Event} event
 * @returns {Promise<void>}
 */
const handleRegisterOrgSubmit = async (event) => {
  event.preventDefault();

  const currentUser = getSessionUser();
  if (!currentUser) {
    showToast({ message: 'Debes iniciar sesión como usuario para registrar una ONG', type: 'warning' });
    return;
  }

  const ongName = document.getElementById('orgName').value;
  const description = document.getElementById('orgDescription').value;
  const contactEmail = document.getElementById('orgEmail').value;
  const image = document.getElementById('orgImage').value;
  const url = document.getElementById('orgUrl').value;

  if (!requiredFieldsFilled([ongName, description, contactEmail])) {
    showToast({ message: 'Completa nombre, descripción y email de contacto', type: 'warning' });
    return;
  }
  if (!hasMinLength(ongName, 3) || !hasMaxLength(ongName, 80)) {
    showToast({ message: 'El nombre de ONG debe tener entre 3 y 80 caracteres', type: 'warning' });
    return;
  }
  if (!hasMinLength(description, 20) || !hasMaxLength(description, 500)) {
    showToast({ message: 'La descripción debe tener entre 20 y 500 caracteres', type: 'warning' });
    return;
  }
  if (!isValidEmail(contactEmail)) {
    showToast({ message: 'Email de contacto no válido', type: 'warning' });
    return;
  }
  if (image && !isValidUrl(image)) {
    showToast({ message: 'La URL de imagen no es válida', type: 'warning' });
    return;
  }
  if (url && !isValidUrl(url)) {
    showToast({ message: 'La web de la ONG no es válida', type: 'warning' });
    return;
  }

  try {
    await registerOngApi({
      ongName,
      description,
      contactEmail,
      image,
      url,
      adminUserId: currentUser.id,
    });
    showToast({ message: 'Solicitud enviada. Un admin debe aprobarla.', type: 'success', delay: 1200 });
    window.setTimeout(() => {
      window.location.href = '/pages/profile.html';
    }, 900);
  } catch (error) {
    showToast({ message: error.message, type: 'error' });
  }
};
if (registerOrgForm) {
  registerOrgForm.addEventListener('submit', handleRegisterOrgSubmit);
}
