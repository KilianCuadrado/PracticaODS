import { nextId, readDb, writeDb } from './db.js';

/**
 * Lista todos los usuarios.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {Array<Record<string, any>>}
 */
export const listUsers = () => {
  const db = readDb();
  return db.users;
};

/**
 * Busca un usuario por id.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} userId
 * @returns {Record<string, any> | null}
 */
export const findUserById = (userId) => {
  const db = readDb();
  for (let i = 0; i < db.users.length; i += 1) {
    if (Number(db.users[i].id) === Number(userId)) {
      return db.users[i];
    }
  }
  return null;
};

/**
 * Busca un usuario por email.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string} email
 * @returns {Record<string, any> | null}
 */
export const findUserByEmail = (email) => {
  const db = readDb();
  for (let i = 0; i < db.users.length; i += 1) {
    if (String(db.users[i].email).toLowerCase() === String(email).toLowerCase()) {
      return db.users[i];
    }
  }
  return null;
};

/**
 * Crea un usuario nuevo.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Record<string, any>} payload
 * @returns {Record<string, any>}
 */
export const createUser = (payload) => {
  const db = readDb();
  const newUser = {
    id: nextId(db.users),
    username: String(payload.username).trim(),
    email: String(payload.email).trim().toLowerCase(),
    password: String(payload.password),
    role: payload.role || 'user',
    orgId: payload.orgId ?? null,
  };
  db.users.push(newUser);
  writeDb(db);
  return newUser;
};

/**
 * Actualiza un usuario existente.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} userId
 * @param {Record<string, any>} payload
 * @returns {Record<string, any> | null}
 */
export const updateUser = (userId, payload) => {
  const db = readDb();
  let userIndex = -1;
  for (let i = 0; i < db.users.length; i += 1) {
    if (Number(db.users[i].id) === Number(userId)) {
      userIndex = i;
      break;
    }
  }
  if (userIndex === -1) {
    return null;
  }

  const currentUser = db.users[userIndex];
  const updatedUser = {
    id: currentUser.id,
    username: payload.username !== undefined ? String(payload.username).trim() : currentUser.username,
    email: payload.email !== undefined ? String(payload.email).trim().toLowerCase() : currentUser.email,
    password: payload.password !== undefined ? String(payload.password) : currentUser.password,
    role: payload.role !== undefined ? String(payload.role) : currentUser.role,
    orgId: payload.orgId !== undefined ? payload.orgId : currentUser.orgId,
  };

  db.users[userIndex] = updatedUser;
  writeDb(db);
  return updatedUser;
};

/**
 * Elimina un usuario y limpia relaciones.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} userId
 * @returns {Record<string, any> | null}
 */
export const deleteUser = (userId) => {
  const db = readDb();
  let userIndex = -1;
  for (let i = 0; i < db.users.length; i += 1) {
    if (Number(db.users[i].id) === Number(userId)) {
      userIndex = i;
      break;
    }
  }
  if (userIndex === -1) {
    return null;
  }

  const deletedUser = db.users.splice(userIndex, 1)[0];

  const remainingParticipants = [];
  for (let i = 0; i < db.eventParticipants.length; i += 1) {
    if (Number(db.eventParticipants[i].userId) !== Number(userId)) {
      remainingParticipants.push(db.eventParticipants[i]);
    }
  }
  db.eventParticipants = remainingParticipants;

  const remainingRequests = [];
  for (let i = 0; i < db.orgJoinRequests.length; i += 1) {
    if (Number(db.orgJoinRequests[i].userId) !== Number(userId)) {
      remainingRequests.push(db.orgJoinRequests[i]);
    }
  }
  db.orgJoinRequests = remainingRequests;

  writeDb(db);
  return deletedUser;
};

/**
 * Lista eventos a los que esta apuntado un usuario.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} userId
 * @returns {Array<Record<string, any>>}
 */
export const listUserEvents = (userId) => {
  const db = readDb();
  const joinedEventIds = [];
  for (let i = 0; i < db.eventParticipants.length; i += 1) {
    if (Number(db.eventParticipants[i].userId) === Number(userId)) {
      joinedEventIds.push(Number(db.eventParticipants[i].eventId));
    }
  }

  const events = [];
  for (let i = 0; i < db.events.length; i += 1) {
    if (joinedEventIds.includes(Number(db.events[i].id))) {
      events.push(db.events[i]);
    }
  }
  return events;
};

/**
 * Lista solicitudes de ORG de un usuario.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} userId
 * @returns {Array<Record<string, any>>}
 */
export const listUserOrgRequests = (userId) => {
  const db = readDb();
  const requests = [];
  for (let i = 0; i < db.orgJoinRequests.length; i += 1) {
    if (Number(db.orgJoinRequests[i].userId) === Number(userId)) {
      requests.push(db.orgJoinRequests[i]);
    }
  }
  return requests;
};
