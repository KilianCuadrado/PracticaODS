import { createResource, deleteResource, getResources, updateResource } from '../api/resourcesApi.js';
import { showToast } from '../components/toast.js';
import { getSessionUser } from '../utils/session.js';
import { requiredFieldsFilled } from '../utils/validators.js';

const resourcesList = document.getElementById('resourcesList');
const resourceForm = document.getElementById('resourceForm');
const resourceFilters = document.getElementById('resourceFilters');
const resourceAuthNotice = document.getElementById('resourceAuthNotice');

const typeLabels = {
  offer: 'Oferta',
  demand: 'Demanda',
};

const statusLabels = {
  open: 'Abierto',
  closed: 'Cerrado',
};

/**
 * Determina si el usuario puede gestionar un recurso.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Record<string, any>} resource
 * @param {Record<string, any> | null} currentUser
 * @returns {boolean}
 */
const canManageResource = (resource, currentUser) => {
  if (!currentUser) {
    return false;
  }
  if (currentUser.role === 'admin') {
    return true;
  }
  if (Number(resource.ownerUserId) === Number(currentUser.id)) {
    return true;
  }
  return currentUser.role === 'ong' && currentUser.ownedOrgId && Number(resource.orgId) === Number(currentUser.ownedOrgId);
};

/**
 * Renderiza recursos en el DOM.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Array<Record<string, any>>} resources
 * @param {Record<string, any> | null} currentUser
 * @returns {void}
 */
const renderResources = (resources, currentUser) => {
  if (!resourcesList) {
    return;
  }
  if (resources.length === 0) {
    resourcesList.innerHTML = '<p class="text-muted">No hay recursos publicados.</p>';
    return;
  }

  resourcesList.innerHTML = resources
    .map((resource) => {
      const canManage = canManageResource(resource, currentUser);
      const quantityLabel = resource.quantity ? `${resource.quantity} ${resource.unit || ''}`.trim() : 'N/A';
      const typeLabel = typeLabels[resource.type] || resource.type;
      const statusLabel = statusLabels[resource.status] || resource.status;
      const statusClass = resource.status === 'open' ? 'bg-success' : 'bg-secondary';
      const toggleStatusLabel = resource.status === 'open' ? 'Cerrar' : 'Reabrir';
      const toggleStatusNext = resource.status === 'open' ? 'closed' : 'open';
      return `
      <article class="card cardFeature p-3">
        <div class="d-flex flex-wrap gap-2 mb-2">
          <span class="badge bg-info">${typeLabel}</span>
          <span class="badge ${statusClass}">${statusLabel}</span>
          <span class="badge bg-light text-dark">${resource.category}</span>
        </div>
        <h3 class="h5">${resource.title}</h3>
        <p class="mb-2">${resource.description}</p>
        <ul class="list-unstyled small mb-3">
          <li><strong>Cantidad:</strong> ${quantityLabel}</li>
          <li><strong>Ubicacion:</strong> ${resource.location || 'No especificada'}</li>
          <li><strong>Estado:</strong> ${resource.condition || 'No especificado'}</li>
        </ul>
        ${
          canManage
            ? `<div class="d-flex gap-2">
                <button class="btn btn-outline-primary btn-sm toggleStatusBtn" data-resource-id="${resource.id}" data-next-status="${toggleStatusNext}">
                  ${toggleStatusLabel}
                </button>
                <button class="btn btn-outline-danger btn-sm deleteResourceBtn" data-resource-id="${resource.id}">
                  Eliminar
                </button>
              </div>`
            : ''
        }
      </article>
    `;
    })
    .join('');
};

/**
 * Lee valores de filtros en pantalla.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {Record<string, string>}
 */
const getFilterValues = () => {
  const type = document.getElementById('filterType')?.value || '';
  const status = document.getElementById('filterStatus')?.value || '';
  const category = document.getElementById('filterCategory')?.value || '';
  const q = document.getElementById('filterSearch')?.value || '';
  return { type, status, category, q };
};

/**
 * Carga recursos y aplica renderizado.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {Promise<void>}
 */
const loadResources = async () => {
  if (!resourcesList) {
    return;
  }
  try {
    const currentUser = getSessionUser();
    const filters = getFilterValues();
    const resources = await getResources(filters);
    renderResources(resources, currentUser);
    bindResourceActions();
  } catch (error) {
    resourcesList.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
};

/**
 * Asigna acciones a botones de recursos.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {void}
 */
const bindResourceActions = () => {
  const toggleButtons = document.querySelectorAll('.toggleStatusBtn');
  toggleButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await updateResource(button.dataset.resourceId, { status: button.dataset.nextStatus });
        await loadResources();
      } catch (error) {
        showToast({ message: error.message, type: 'error' });
      }
    });
  });

  const deleteButtons = document.querySelectorAll('.deleteResourceBtn');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await deleteResource(button.dataset.resourceId);
        showToast({ message: 'Recurso eliminado', type: 'success' });
        await loadResources();
      } catch (error) {
        showToast({ message: error.message, type: 'error' });
      }
    });
  });
};

/**
 * Configura el acceso al formulario segun sesion.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {void}
 */
const setupFormAccess = () => {
  if (!resourceForm) {
    return;
  }
  const currentUser = getSessionUser();
  const formElements = Array.from(resourceForm.elements);
  if (!currentUser) {
    formElements.forEach((element) => {
      element.disabled = true;
    });
    if (resourceAuthNotice) {
      resourceAuthNotice.textContent = 'Inicia sesion para publicar un recurso.';
    }
  } else if (resourceAuthNotice) {
    resourceAuthNotice.textContent = `Publicando como ${currentUser.username}`;
  }
};

/**
 * Gestiona el submit del recurso.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Event} event
 * @returns {Promise<void>}
 */
const handleResourceSubmit = async (event) => {
  event.preventDefault();
  const currentUser = getSessionUser();
  if (!currentUser) {
    showToast({ message: 'Debes iniciar sesion para publicar', type: 'warning' });
    return;
  }
  const type = document.getElementById('resourceType')?.value || '';
  const title = document.getElementById('resourceTitle')?.value || '';
  const description = document.getElementById('resourceDescription')?.value || '';
  const category = document.getElementById('resourceCategory')?.value || '';
  const quantity = document.getElementById('resourceQuantity')?.value || '';
  const unit = document.getElementById('resourceUnit')?.value || '';
  const location = document.getElementById('resourceLocation')?.value || '';
  const condition = document.getElementById('resourceCondition')?.value || '';

  if (!requiredFieldsFilled([type, title, description, category])) {
    showToast({ message: 'Completa los campos obligatorios', type: 'warning' });
    return;
  }

  try {
    await createResource({
      type,
      title,
      description,
      category,
      quantity: quantity ? Number(quantity) : null,
      unit,
      location,
      condition,
    });
    resourceForm.reset();
    showToast({ message: 'Recurso publicado', type: 'success' });
    await loadResources();
  } catch (error) {
    showToast({ message: error.message, type: 'error' });
  }
};

/**
 * Inicializa la vista de recursos.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {void}
 */
const initResourcesPage = () => {
  setupFormAccess();
  if (resourceForm) {
    resourceForm.addEventListener('submit', handleResourceSubmit);
  }
  if (resourceFilters) {
    resourceFilters.addEventListener('submit', (event) => {
      event.preventDefault();
      loadResources();
    });
    resourceFilters.querySelectorAll('select, input').forEach((element) => {
      element.addEventListener('change', () => loadResources());
    });
  }
  loadResources();
};

document.addEventListener('DOMContentLoaded', initResourcesPage);
