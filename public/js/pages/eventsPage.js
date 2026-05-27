import { getEvents, joinEvent } from '../api/eventsApi.js';
import { showToast } from '../components/toast.js';
import { getSessionUser } from '../utils/session.js';

const eventList = document.getElementById('eventsList');

/**
 * Renderiza lista de eventos en el DOM.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Array<Record<string, any>>} events
 * @returns {void}
 */
const renderEvents = (events) => {
  if (!eventList) {
    return;
  }
  if (events.length === 0) {
    eventList.innerHTML = '<p class="text-muted">No hay eventos disponibles.</p>';
    return;
  }

  eventList.innerHTML = events
    .map(
      (eventItem) => `
      <article class="card cardFeature p-3">
        <h3 class="h5">${eventItem.title}</h3>
        <p class="mb-2">${eventItem.description}</p>
        <p class="mb-3"><strong>Fecha:</strong> ${eventItem.date}</p>
        <div class="d-flex gap-2">
          <a class="btn btn-outline-primary btn-sm" href="/pages/event-detail.html?id=${eventItem.id}">Detalle</a>
          <button class="btn btn-success btn-sm joinEventBtn" data-event-id="${eventItem.id}">Unirme</button>
        </div>
      </article>
    `,
    )
    .join('');
};

/**
 * Asigna acciones a botones de unirse.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {void}
 */
const bindJoinButtons = () => {
  const currentUser = getSessionUser();
  const joinButtons = document.querySelectorAll('.joinEventBtn');
  joinButtons.forEach((joinButton) => {
    joinButton.addEventListener('click', async () => {
      if (!currentUser) {
        showToast({ message: 'Debes iniciar sesión para unirte', type: 'warning' });
        return;
      }
      try {
        await joinEvent(joinButton.dataset.eventId, currentUser.id);
        showToast({ message: 'Te has unido al evento', type: 'success' });
      } catch (error) {
        showToast({ message: error.message, type: 'error' });
      }
    });
  });
};

/**
 * Inicializa la vista de eventos.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {Promise<void>}
 */
const initEventsPage = async () => {
  try {
    const events = await getEvents();
    renderEvents(events);
    bindJoinButtons();
  } catch (error) {
    if (eventList) {
      eventList.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
  }
};

document.addEventListener('DOMContentLoaded', initEventsPage);
