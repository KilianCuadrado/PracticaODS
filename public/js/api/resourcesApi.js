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
 * Obtiene recursos filtrados.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Record<string, string | number | boolean>} filters
 * @returns {Promise<any>}
 * @throws {Error} Cuando la respuesta no es OK.
 */
export const getResources = async (filters = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/resources${buildQuery(filters)}`, { headers });

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
 * Obtiene un recurso por id.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} resourceId
 * @returns {Promise<any>}
 * @throws {Error} Cuando la respuesta no es OK.
 */
export const getResourceById = async (resourceId) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/resources/${resourceId}`, { headers });

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
 * Crea un recurso.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Record<string, any>} payload
 * @returns {Promise<any>}
 * @throws {Error} Cuando la respuesta no es OK.
 */
export const createResource = async (payload) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch('/api/resources', {
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
 * Actualiza un recurso.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} resourceId
 * @param {Record<string, any>} payload
 * @returns {Promise<any>}
 * @throws {Error} Cuando la respuesta no es OK.
 */
export const updateResource = async (resourceId, payload) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/resources/${resourceId}`, {
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
 * Elimina un recurso.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} resourceId
 * @returns {Promise<any>}
 * @throws {Error} Cuando la respuesta no es OK.
 */
export const deleteResource = async (resourceId) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch(`/api/resources/${resourceId}`, { method: 'DELETE', headers });

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
