import { nextId, readDb, writeDb } from './db.js';

/**
 * Lista eventos con filtro opcional por orgId.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} orgId
 * @returns {Array<Record<string, any>>}
 */
export const listEvents = (orgId) => {
  const db = readDb();
  if (orgId === null || orgId === undefined || Number.isNaN(orgId)) {
    return db.events;
  }
  const filtered = [];
  for (let i = 0; i < db.events.length; i += 1) {
    if (Number(db.events[i].orgId) === Number(orgId)) {
      filtered.push(db.events[i]);
    }
  }
  return filtered;
};

/**
 * Busca un evento por id.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} eventId
 * @returns {Record<string, any> | null}
 */
export const findEventById = (eventId) => {
  const db = readDb();
  for (let i = 0; i < db.events.length; i += 1) {
    if (Number(db.events[i].id) === Number(eventId)) {
      return db.events[i];
    }
  }
  return null;
};

/**
 * Crea un evento.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Record<string, any>} payload
 * @returns {Record<string, any>}
 */
export const createEvent = (payload) => {
  const db = readDb();
  const newEvent = {
    id: nextId(db.events),
    title: String(payload.title).trim(),
    description: String(payload.description).trim(),
    date: String(payload.date),
    orgId: Number(payload.orgId),
  };
  db.events.push(newEvent);
  writeDb(db);
  return newEvent;
};

/**
 * Actualiza un evento.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} eventId
 * @param {Record<string, any>} payload
 * @returns {Record<string, any> | null}
 */
export const updateEvent = (eventId, payload) => {
  const db = readDb();
  let eventIndex = -1;
  for (let i = 0; i < db.events.length; i += 1) {
    if (Number(db.events[i].id) === Number(eventId)) {
      eventIndex = i;
      break;
    }
  }
  if (eventIndex === -1) {
    return null;
  }

  const currentEvent = db.events[eventIndex];
  const updatedEvent = {
    id: currentEvent.id,
    title: payload.title !== undefined ? String(payload.title).trim() : currentEvent.title,
    description:
      payload.description !== undefined
        ? String(payload.description).trim()
        : currentEvent.description,
    date: payload.date !== undefined ? String(payload.date) : currentEvent.date,
    orgId: currentEvent.orgId,
  };

  db.events[eventIndex] = updatedEvent;
  writeDb(db);
  return updatedEvent;
};

/**
 * Elimina un evento y limpia participantes.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} eventId
 * @returns {Record<string, any> | null}
 */
export const deleteEvent = (eventId) => {
  const db = readDb();
  let eventIndex = -1;
  for (let i = 0; i < db.events.length; i += 1) {
    if (Number(db.events[i].id) === Number(eventId)) {
      eventIndex = i;
      break;
    }
  }
  if (eventIndex === -1) {
    return null;
  }

  const deletedEvent = db.events.splice(eventIndex, 1)[0];

  const remainingParticipants = [];
  for (let i = 0; i < db.eventParticipants.length; i += 1) {
    if (Number(db.eventParticipants[i].eventId) !== Number(eventId)) {
      remainingParticipants.push(db.eventParticipants[i]);
    }
  }
  db.eventParticipants = remainingParticipants;

  writeDb(db);
  return deletedEvent;
};

/**
 * Crea una inscripcion a un evento.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} eventId
 * @param {string | number} userId
 * @returns {{ entry: Record<string, any> } | { error: string }}
 */
export const joinEvent = (eventId, userId) => {
  const db = readDb();

  let eventExists = false;
  for (let i = 0; i < db.events.length; i += 1) {
    if (Number(db.events[i].id) === Number(eventId)) {
      eventExists = true;
      break;
    }
  }

  let userExists = false;
  for (let i = 0; i < db.users.length; i += 1) {
    if (Number(db.users[i].id) === Number(userId)) {
      userExists = true;
      break;
    }
  }

  if (!eventExists || !userExists) {
    return { error: 'not-found' };
  }

  for (let i = 0; i < db.eventParticipants.length; i += 1) {
    if (
      Number(db.eventParticipants[i].eventId) === Number(eventId) &&
      Number(db.eventParticipants[i].userId) === Number(userId)
    ) {
      return { error: 'duplicate' };
    }
  }

  const newJoin = {
    id: nextId(db.eventParticipants),
    eventId,
    userId,
    createdAt: new Date().toISOString(),
  };
  db.eventParticipants.push(newJoin);
  writeDb(db);
  return { entry: newJoin };
};

/**
 * Elimina una inscripcion a un evento.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} eventId
 * @param {string | number} userId
 * @returns {Record<string, any> | null}
 */
export const leaveEvent = (eventId, userId) => {
  const db = readDb();
  let deletedJoin = null;
  const remaining = [];
  for (let i = 0; i < db.eventParticipants.length; i += 1) {
    const entry = db.eventParticipants[i];
    if (Number(entry.eventId) === Number(eventId) && Number(entry.userId) === Number(userId)) {
      deletedJoin = entry;
    } else {
      remaining.push(entry);
    }
  }

  if (!deletedJoin) {
    return null;
  }

  db.eventParticipants = remaining;
  writeDb(db);
  return deletedJoin;
};
