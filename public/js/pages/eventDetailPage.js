import { getEventById, joinEvent } from '../api/eventsApi.js';
import { showToast } from '../components/toast.js';
import { getSessionUser } from '../utils/session.js';

const detailContainer = document.getElementById('eventDetailContainer');

/**
 * Inicializa la vista de detalle de evento.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {Promise<void>}
 */
const initEventDetailPage = async () => {
  const queryParams = new URLSearchParams(window.location.search);
  const eventId = queryParams.get('id');
  if (!eventId || !detailContainer) {
    return;
  }

  try {
    const eventItem = await getEventById(eventId);
    detailContainer.innerHTML = `
      <article class="card cardFeature p-4">
        <h1 class="h3 mb-3">${eventItem.title}</h1>
        <p>${eventItem.description}</p>
        <p><strong>Fecha:</strong> ${eventItem.date}</p>
        <button class="btn btn-success" id="joinDetailButton">Unirme a este evento</button>
      </article>
    `;
    const joinDetailButton = document.getElementById('joinDetailButton');
    joinDetailButton.addEventListener('click', async () => {
      const currentUser = getSessionUser();
      if (!currentUser) {
        showToast({ message: 'Debes iniciar sesión para unirte', type: 'warning' });
        return;
      }
      try {
        await joinEvent(eventId, currentUser.id);
        showToast({ message: 'Inscripción completada', type: 'success' });
      } catch (error) {
        showToast({ message: error.message, type: 'error' });
      }
    });
  } catch (error) {
    detailContainer.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
};

document.addEventListener('DOMContentLoaded', initEventDetailPage);
