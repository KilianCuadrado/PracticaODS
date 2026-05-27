import {
  createNewEvent,
  deleteEventById,
  getEventById,
  getEvents,
  joinEventById,
  leaveEventById,
  updateEventById,
} from '../controllers/eventsController.js';

/**
 * Registra rutas de eventos.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Application} app
 * @returns {void}
 */
export const registerEventRoutes = (app) => {
  app.get('/api/events', getEvents);
  app.get('/api/events/:id', getEventById);
  app.post('/api/events', createNewEvent);
  app.put('/api/events/:id', updateEventById);
  app.delete('/api/events/:id', deleteEventById);
  app.post('/api/events/:id/join', joinEventById);
  app.delete('/api/events/:id/join/:userId', leaveEventById);
};
