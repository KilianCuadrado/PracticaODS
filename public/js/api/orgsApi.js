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
 * Obtiene organizaciones por estado.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string} status
 * @returns {Promise<any>}
 * @throws {Error} Cuando la respuesta no es OK.
 */
export const getOngs = async (status) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/ongs${buildQuery({ status })}`, { headers });

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
 * Obtiene una organizacion por id.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} orgId
 * @returns {Promise<any>}
 * @throws {Error} Cuando la respuesta no es OK.
 */
export const getOngById = async (ongId) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/ongs/${ongId}`, { headers });

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
 * Crea una organizacion.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Record<string, any>} payload
 * @returns {Promise<any>}
 * @throws {Error} Cuando la respuesta no es OK.
 */
export const createOng = async (payload) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch('/api/ongs', {
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
 * Actualiza una organizacion.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} orgId
 * @param {Record<string, any>} payload
 * @returns {Promise<any>}
 * @throws {Error} Cuando la respuesta no es OK.
 */
export const updateOng = async (ongId, payload) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/ongs/${ongId}`, {
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
 * Elimina una organizacion.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} orgId
 * @returns {Promise<any>}
 * @throws {Error} Cuando la respuesta no es OK.
 */
export const deleteOng = async (ongId) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/ongs/${ongId}`, { method: 'DELETE', headers });

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
 * Cambia el estado de una organizacion.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} orgId
 * @param {string} status
 * @returns {Promise<any>}
 * @throws {Error} Cuando la respuesta no es OK.
 */
export const setOngStatus = async (ongId, status) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/ongs/${ongId}/status`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status }),
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
 * Solicita union a una organizacion.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} orgId
 * @param {string | number} userId
 * @returns {Promise<any>}
 * @throws {Error} Cuando la respuesta no es OK.
 */
export const requestJoinOng = async (ongId, userId) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/ongs/${ongId}/join-requests`, {
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
 * Obtiene solicitudes de union de una organizacion.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} orgId
 * @returns {Promise<any>}
 * @throws {Error} Cuando la respuesta no es OK.
 */
export const getOngRequests = async (ongId) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/ongs/${ongId}/join-requests`, { headers });

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
 * Resuelve una solicitud de union de una organizacion.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} orgId
 * @param {string | number} requestId
 * @param {string} status
 * @returns {Promise<any>}
 * @throws {Error} Cuando la respuesta no es OK.
 */
export const resolveOngRequest = async (ongId, requestId, status) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/ongs/${ongId}/join-requests/${requestId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status }),
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
