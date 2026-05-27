import { getSessionUser } from '../utils/session.js';

/**
 * Build a query string from params, ignoring empty values.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Record<string, string | number | boolean>} params
 * @returns {string}
 */
const buildQuery = (params) => {
  if (!params) {
    return '';
  }
  const pairs = [];
  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (value === undefined || value === null) {
      return;
    }
    const textValue = String(value).trim();
    if (!textValue) {
      return;
    }
    pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(textValue)}`);
  });
  return pairs.length ? `?${pairs.join('&')}` : '';
};

/**
 * Obtiene eventos, opcionalmente filtrados por ORG.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} orgId
 * @returns {Promise<any>}
 * @throws {Error} Cuando la respuesta no es OK.
 */
export const getEvents = async (orgId) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/events${buildQuery({ orgId })}`, { headers });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data && data.message ? data.message : 'Error en la petición';
    throw new Error(message);
  }

  return data;
};

/**
 * Obtiene un evento por id.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} eventId
 * @returns {Promise<any>}
 * @throws {Error} Cuando la respuesta no es OK.
 */
export const getEventById = async (eventId) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/events/${eventId}`, { headers });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data && data.message ? data.message : 'Error en la petición';
    throw new Error(message);
  }

  return data;
};

/**
 * Crea un evento.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Record<string, any>} payload
 * @returns {Promise<any>}
 * @throws {Error} Cuando la respuesta no es OK.
 */
export const createEvent = async (payload) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch('/api/events', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data && data.message ? data.message : 'Error en la petición';
    throw new Error(message);
  }

  return data;
};

/**
 * Actualiza un evento.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} eventId
 * @param {Record<string, any>} payload
 * @returns {Promise<any>}
 * @throws {Error} Cuando la respuesta no es OK.
 */
export const updateEvent = async (eventId, payload) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/events/${eventId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data && data.message ? data.message : 'Error en la petición';
    throw new Error(message);
  }

  return data;
};

/**
 * Elimina un evento.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} eventId
 * @returns {Promise<any>}
 * @throws {Error} Cuando la respuesta no es OK.
 */
export const deleteEvent = async (eventId) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/events/${eventId}`, { method: 'DELETE', headers });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data && data.message ? data.message : 'Error en la petición';
    throw new Error(message);
  }

  return data;
};

/**
 * Une un usuario a un evento.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} eventId
 * @param {string | number} userId
 * @returns {Promise<any>}
 * @throws {Error} Cuando la respuesta no es OK.
 */
export const joinEvent = async (eventId, userId) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/events/${eventId}/join`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ userId }),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data && data.message ? data.message : 'Error en la petición';
    throw new Error(message);
  }

  return data;
};

/**
 * Sale de un evento.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} eventId
 * @param {string | number} userId
 * @returns {Promise<any>}
 * @throws {Error} Cuando la respuesta no es OK.
 */
export const leaveEvent = async (eventId, userId) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/events/${eventId}/join/${userId}`, { method: 'DELETE', headers });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data && data.message ? data.message : 'Error en la petición';
    throw new Error(message);
  }

  return data;
};
