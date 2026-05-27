import {
  createEvent,
  deleteEvent,
  findEventById,
  joinEvent,
  leaveEvent,
  listEvents,
  updateEvent,
} from '../models/eventsModel.js';
import { parseId, sendError } from '../utils/http.js';

/**
 * Listado de eventos.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const getEvents = (req, res) => {
  const orgId = req.query?.orgId ? parseId(req.query.orgId) : null;
  const events = listEvents(orgId);
  return res.json(events);
};

/**
 * Detalle de evento.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const getEventById = (req, res) => {
  const eventId = parseId(req.params.id);
  if (Number.isNaN(eventId)) {
    return sendError(res, 400, 'ID de evento no válido');
  }
  const event = findEventById(eventId);
  if (!event) {
    return sendError(res, 404, 'Evento no encontrado');
  }
  return res.json(event);
};

/**
 * Crear evento.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const createNewEvent = (req, res) => {
  const title = req.body?.title;
  const description = req.body?.description;
  const date = req.body?.date;
  const orgId = req.body?.orgId;

  if (!title || !description || !date || !orgId) {
    return sendError(res, 400, 'title, description, date y orgId son obligatorios');
  }

  const newEvent = createEvent({ title, description, date, orgId });
  return res.status(201).json(newEvent);
};

/**
 * Actualizar evento.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const updateEventById = (req, res) => {
  const eventId = parseId(req.params.id);
  if (Number.isNaN(eventId)) {
    return sendError(res, 400, 'ID de evento no válido');
  }

  const currentEvent = findEventById(eventId);
  if (!currentEvent) {
    return sendError(res, 404, 'Evento no encontrado');
  }

  const updatedEvent = updateEvent(eventId, {
    title: req.body?.title,
    description: req.body?.description,
    date: req.body?.date,
  });

  return res.json(updatedEvent);
};

/**
 * Eliminar evento.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const deleteEventById = (req, res) => {
  const eventId = parseId(req.params.id);
  if (Number.isNaN(eventId)) {
    return sendError(res, 400, 'ID de evento no válido');
  }

  const deletedEvent = deleteEvent(eventId);
  if (!deletedEvent) {
    return sendError(res, 404, 'Evento no encontrado');
  }

  return res.json({ message: 'Evento eliminado', event: deletedEvent });
};

/**
 * Inscribir usuario en evento.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const joinEventById = (req, res) => {
  const eventId = parseId(req.params.id);
  const userId = parseId(req.body?.userId);
  if (Number.isNaN(eventId) || Number.isNaN(userId)) {
    return sendError(res, 400, 'eventId y userId deben ser válidos');
  }

  const result = joinEvent(eventId, userId);
  if (result.error === 'not-found') {
    return sendError(res, 404, 'Evento o usuario no encontrado');
  }
  if (result.error === 'duplicate') {
    return sendError(res, 409, 'El usuario ya está apuntado a este evento');
  }

  return res.status(201).json(result.entry);
};

/**
 * Desapuntar usuario de un evento.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const leaveEventById = (req, res) => {
  const eventId = parseId(req.params.id);
  const userId = parseId(req.params.userId);
  if (Number.isNaN(eventId) || Number.isNaN(userId)) {
    return sendError(res, 400, 'eventId y userId deben ser válidos');
  }

  const deletedJoin = leaveEvent(eventId, userId);
  if (!deletedJoin) {
    return sendError(res, 404, 'No existe la inscripción del usuario en este evento');
  }

  return res.json({ message: 'Inscripción eliminada', entry: deletedJoin });
};
