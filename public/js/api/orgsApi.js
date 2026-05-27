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
export const getOrgs = async (status) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/orgs${buildQuery({ status })}`, { headers });

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
export const getOrgById = async (orgId) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/orgs/${orgId}`, { headers });

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
export const createOrg = async (payload) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch('/api/orgs', {
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
export const updateOrg = async (orgId, payload) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/orgs/${orgId}`, {
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
export const deleteOrg = async (orgId) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/orgs/${orgId}`, { method: 'DELETE', headers });

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
export const setOrgStatus = async (orgId, status) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/orgs/${orgId}/status`, {
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
export const requestJoinOrg = async (orgId, userId) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/orgs/${orgId}/join-requests`, {
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
export const getOrgRequests = async (orgId) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/orgs/${orgId}/join-requests`, { headers });

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
export const resolveOrgRequest = async (orgId, requestId, status) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/orgs/${orgId}/join-requests/${requestId}`, {
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
