import { getSessionUser } from '../utils/session.js';

/**
 * Inicia sesion y devuelve el usuario autenticado.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string} email
 * @param {string} password
 * @returns {Promise<any>}
 * @throws {Error} Cuando la respuesta no es OK.
 */
export const loginUser = async (email, password) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, password }),
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
 * Registra un usuario nuevo.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {Promise<any>}
 * @throws {Error} Cuando la respuesta no es OK.
 */
export const registerUserApi = async (username, email, password) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch('/api/auth/register-user', {
    method: 'POST',
    headers,
    body: JSON.stringify({ username, email, password }),
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
 * Registra una organizacion.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Record<string, any>} payload
 * @returns {Promise<any>}
 * @throws {Error} Cuando la respuesta no es OK.
 */
export const registerOrgApi = async (payload) => {
  const headers = { 'Content-Type': 'application/json' };
  const currentUser = getSessionUser();
  if (currentUser) {
    headers['x-user-role'] = currentUser.role || 'user';
    headers['x-user-id'] = String(currentUser.id);
    if (currentUser.ownedOrgId) {
      headers['x-org-id'] = String(currentUser.ownedOrgId);
    }
  }
  const response = await fetch('/api/auth/register-org', {
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
