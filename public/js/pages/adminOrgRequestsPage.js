import { getOngs, setOngStatus } from '../api/orgsApi.js';
import { showToast } from '../components/toast.js';
import { getSessionUser } from '../utils/session.js';

const orgRequestsBody = document.getElementById('adminOrgRequestsBody');

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
 * Carga ONGs pendientes y asigna acciones.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {Promise<void>}
 */
const loadPendingOrgs = async () => {
  if (!ensureAdmin()) {
    return;
  }
  const pendingOrgs = await getOngs('pending');
  orgRequestsBody.innerHTML = pendingOrgs.length
    ? pendingOrgs
        .map(
          (orgItem) => `
          <tr>
            <td>${orgItem.id}</td>
            <td>${orgItem.name || orgItem.nom}</td>
            <td>${orgItem.contactEmail || 'n/d'}</td>
            <td>${orgItem.description}</td>
            <td>
              <button class="btn btn-sm btn-success approveOrgBtn" data-id="${orgItem.id}">Aprovar</button>
              <button class="btn btn-sm btn-danger rejectOrgBtn" data-id="${orgItem.id}">Rebutjar</button>
            </td>
          </tr>
        `,
        )
        .join('')
    : '<tr><td colspan="5" class="text-muted">No hay solicitudes pendientes</td></tr>';

  document.querySelectorAll('.approveOrgBtn').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await setOngStatus(button.dataset.id, 'approved');
        await loadPendingOrgs();
        showToast({ message: 'ONG aprobada', type: 'success' });
      } catch (error) {
        showToast({ message: error.message, type: 'error' });
      }
    });
  });

  document.querySelectorAll('.rejectOrgBtn').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await setOngStatus(button.dataset.id, 'rejected');
        await loadPendingOrgs();
        showToast({ message: 'ONG rechazada', type: 'success' });
      } catch (error) {
        showToast({ message: error.message, type: 'error' });
      }
    });
  });
};

/**
 * Inicializa la vista de solicitudes de ONG.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {Promise<void>}
 */
const initAdminOrgRequestsPage = async () => {
  try {
    await loadPendingOrgs();
  } catch (error) {
    orgRequestsBody.innerHTML = `<tr><td colspan="5">${error.message}</td></tr>`;
  }
};

document.addEventListener('DOMContentLoaded', initAdminOrgRequestsPage);
