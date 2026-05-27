import { createUser, deleteUser, getUsers, updateUser } from '../api/usersApi.js';
import { showToast } from '../components/toast.js';
import { getSessionUser } from '../utils/session.js';
import { hasMaxLength, hasMinLength, isValidEmail, requiredFieldsFilled } from '../utils/validators.js';

const usersTableBody = document.getElementById('usersTableBody');
const userForm = document.getElementById('adminUserForm');

/**
 * Verifica sesion admin y redirige si no aplica.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {boolean}
 */
const ensureAdmin = () => {
  const currentUser = getSessionUser();
  if (!currentUser || currentUser.role !== 'admin') {
    window.location.href = '/pages/login.html';
    return false;
  }
  return true;
};

/**
 * Carga usuarios y asigna acciones.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {Promise<void>}
 */
const loadUsers = async () => {
  if (!ensureAdmin()) {
    return;
  }
  const users = await getUsers();
  usersTableBody.innerHTML = users
    .map(
      (userItem) => `
      <tr>
        <td>${userItem.id}</td>
        <td>${userItem.username}</td>
        <td>${userItem.email}</td>
        <td>${userItem.role || 'user'}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary editUserBtn" data-id="${userItem.id}" data-name="${userItem.username}" data-role="${userItem.role || 'user'}">Editar</button>
          <button class="btn btn-sm btn-danger deleteUserBtn" data-id="${userItem.id}">Eliminar</button>
        </td>
      </tr>
    `,
    )
    .join('');

  document.querySelectorAll('.deleteUserBtn').forEach((button) => {
    button.addEventListener('click', async () => {
      if (!confirm('¿Eliminar usuario?')) {
        return;
      }
      try {
        await deleteUser(button.dataset.id);
        await loadUsers();
        showToast({ message: 'Usuario eliminado', type: 'success' });
      } catch (error) {
        showToast({ message: error.message, type: 'error' });
      }
    });
  });

  document.querySelectorAll('.editUserBtn').forEach((button) => {
    button.addEventListener('click', () => {
      document.getElementById('adminUserId').value = button.dataset.id;
      document.getElementById('adminUserName').value = button.dataset.name;
      document.getElementById('adminUserRole').value = button.dataset.role;
    });
  });
};

/**
 * Inicializa la vista de admin usuarios.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {Promise<void>}
 */
const initAdminUsersPage = async () => {
  try {
    await loadUsers();
  } catch (error) {
    usersTableBody.innerHTML = `<tr><td colspan="5">${error.message}</td></tr>`;
  }
};

document.addEventListener('DOMContentLoaded', initAdminUsersPage);

/**
 * Gestiona el submit del formulario admin.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Event} event
 * @returns {Promise<void>}
 */
const handleUserSubmit = async (event) => {
  event.preventDefault();
  if (!ensureAdmin()) {
    return;
  }

  const userId = document.getElementById('adminUserId').value;
  const username = document.getElementById('adminUserName').value;
  const email = document.getElementById('adminUserEmail').value;
  const password = document.getElementById('adminUserPassword').value;
  const role = document.getElementById('adminUserRole').value;

  if (!requiredFieldsFilled([username])) {
    showToast({ message: 'El nombre es obligatorio', type: 'warning' });
    return;
  }
  if (!hasMinLength(username, 2) || !hasMaxLength(username, 40)) {
    showToast({ message: 'El nombre debe tener entre 2 y 40 caracteres', type: 'warning' });
    return;
  }
  if (email && !isValidEmail(email)) {
    showToast({ message: 'El email no es válido', type: 'warning' });
    return;
  }
  if (password && !hasMinLength(password, 6)) {
    showToast({ message: 'La contraseña debe tener mínimo 6 caracteres', type: 'warning' });
    return;
  }

  try {
    if (userId) {
      const updatePayload = { username, role };
      if (email) {
        updatePayload.email = email;
      }
      if (password) {
        updatePayload.password = password;
      }
      await updateUser(userId, updatePayload);
    } else {
      if (!requiredFieldsFilled([email, password])) {
        showToast({ message: 'Para crear usuario, email y password son obligatorios', type: 'warning' });
        return;
      }
      await createUser({ username, email, password, role });
    }
    userForm.reset();
    document.getElementById('adminUserId').value = '';
    await loadUsers();
    showToast({ message: userId ? 'Usuario actualizado' : 'Usuario creado', type: 'success' });
  } catch (error) {
    showToast({ message: error.message, type: 'error' });
  }
};

if (userForm) {
  userForm.addEventListener('submit', handleUserSubmit);
}
