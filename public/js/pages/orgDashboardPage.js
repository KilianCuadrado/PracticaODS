import { createEvent, deleteEvent, getEvents, updateEvent } from '../api/eventsApi.js';
import { getOrgRequests, resolveOrgRequest } from '../api/orgsApi.js';
import { showToast } from '../components/toast.js';
import { getSessionUser } from '../utils/session.js';
import { hasMaxLength, hasMinLength, isFutureOrToday, requiredFieldsFilled } from '../utils/validators.js';

const orgEventsBody = document.getElementById('orgEventsBody');
const orgRequestsBody = document.getElementById('orgRequestsBody');
const eventForm = document.getElementById('orgEventForm');

/**
 * Obtiene la org del usuario org y redirige si no aplica.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {number | null}
 */
const getOwnedOrgId = () => {
  const currentUser = getSessionUser();
  if (!currentUser || currentUser.role !== 'org' || !currentUser.ownedOrgId) {
    window.location.href = '/pages/login.html';
    return null;
  }
  return currentUser.ownedOrgId;
};

/**
 * Carga eventos de la org y renderiza la tabla.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} orgId
 * @returns {Promise<void>}
 */
const loadOrgEvents = async (orgId) => {
  const events = await getEvents(orgId);
  orgEventsBody.innerHTML = events.length
    ? events
        .map(
          (eventItem) => `
          <tr>
            <td>${eventItem.id}</td>
            <td>${eventItem.title}</td>
            <td>${eventItem.date}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary editEventBtn" data-id="${eventItem.id}" data-title="${eventItem.title}" data-description="${eventItem.description}" data-date="${eventItem.date}">Editar</button>
              <button class="btn btn-sm btn-danger deleteEventBtn" data-id="${eventItem.id}">Eliminar</button>
            </td>
          </tr>
        `,
        )
        .join('')
    : '<tr><td colspan="4" class="text-muted">Sin eventos</td></tr>';

  document.querySelectorAll('.deleteEventBtn').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await deleteEvent(button.dataset.id);
        await loadOrgEvents(orgId);
        showToast({ message: 'Evento eliminado', type: 'success' });
      } catch (error) {
        showToast({ message: error.message, type: 'error' });
      }
    });
  });

  document.querySelectorAll('.editEventBtn').forEach((button) => {
    button.addEventListener('click', () => {
      document.getElementById('orgEventId').value = button.dataset.id;
      document.getElementById('orgEventTitle').value = button.dataset.title;
      document.getElementById('orgEventDescription').value = button.dataset.description;
      document.getElementById('orgEventDate').value = button.dataset.date;
    });
  });
};

/**
 * Carga solicitudes de union de la org.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} orgId
 * @returns {Promise<void>}
 */
const loadOrgRequests = async (orgId) => {
  const requests = await getOrgRequests(orgId);
  const pendingRequests = requests.filter((request) => request.status === 'pending');
  orgRequestsBody.innerHTML = pendingRequests.length
    ? pendingRequests
        .map(
          (requestItem) => `
          <tr>
            <td>${requestItem.id}</td>
            <td>${requestItem.userId}</td>
            <td>${requestItem.status}</td>
            <td>
              <button class="btn btn-sm btn-success approveJoinBtn" data-id="${requestItem.id}">Aprobar</button>
              <button class="btn btn-sm btn-danger rejectJoinBtn" data-id="${requestItem.id}">Rechazar</button>
            </td>
          </tr>
        `,
        )
        .join('')
    : '<tr><td colspan="4" class="text-muted">Sin solicitudes pendientes</td></tr>';

  document.querySelectorAll('.approveJoinBtn').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await resolveOrgRequest(orgId, button.dataset.id, 'approved');
        await loadOrgRequests(orgId);
        showToast({ message: 'Solicitud aprobada', type: 'success' });
      } catch (error) {
        showToast({ message: error.message, type: 'error' });
      }
    });
  });

  document.querySelectorAll('.rejectJoinBtn').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await resolveOrgRequest(orgId, button.dataset.id, 'rejected');
        await loadOrgRequests(orgId);
        showToast({ message: 'Solicitud rechazada', type: 'success' });
      } catch (error) {
        showToast({ message: error.message, type: 'error' });
      }
    });
  });
};

/**
 * Inicializa el dashboard de org.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {Promise<void>}
 */
const initOrgDashboardPage = async () => {
  const orgId = getOwnedOrgId();
  if (!orgId) {
    return;
  }
  try {
    await Promise.all([loadOrgEvents(orgId), loadOrgRequests(orgId)]);
  } catch (error) {
    orgEventsBody.innerHTML = `<tr><td colspan="4">${error.message}</td></tr>`;
  }
};

document.addEventListener('DOMContentLoaded', initOrgDashboardPage);

/**
 * Gestiona el submit del formulario de evento.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Event} event
 * @returns {Promise<void>}
 */
const handleEventSubmit = async (event) => {
  event.preventDefault();
  const orgId = getOwnedOrgId();
  if (!orgId) {
    return;
  }
  const eventId = document.getElementById('orgEventId').value;
  const title = document.getElementById('orgEventTitle').value;
  const description = document.getElementById('orgEventDescription').value;
  const date = document.getElementById('orgEventDate').value;
  if (!requiredFieldsFilled([title, description, date])) {
    showToast({ message: 'Completa título, descripción y fecha', type: 'warning' });
    return;
  }
  if (!hasMinLength(title, 3) || !hasMaxLength(title, 100)) {
    showToast({ message: 'El título debe tener entre 3 y 100 caracteres', type: 'warning' });
    return;
  }
  if (!hasMinLength(description, 10) || !hasMaxLength(description, 600)) {
    showToast({ message: 'La descripción debe tener entre 10 y 600 caracteres', type: 'warning' });
    return;
  }
  if (!isFutureOrToday(date)) {
    showToast({ message: 'La fecha debe ser hoy o posterior', type: 'warning' });
    return;
  }

  try {
    if (eventId) {
      await updateEvent(eventId, { title, description, date, orgId });
    } else {
      await createEvent({ title, description, date, orgId });
    }
    eventForm.reset();
    document.getElementById('orgEventId').value = '';
    await loadOrgEvents(orgId);
    showToast({ message: eventId ? 'Evento actualizado' : 'Evento creado', type: 'success' });
  } catch (error) {
    showToast({ message: error.message, type: 'error' });
  }
};

if (eventForm) {
  eventForm.addEventListener('submit', handleEventSubmit);
}
