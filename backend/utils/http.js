import jwt from 'jsonwebtoken';
import config from '../config.js';

/**
 * Parsea un id numerico desde un valor.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} value
 * @returns {number}
 */
export const parseId = (value) => Number.parseInt(value, 10);

/**
 * Valida si un email tiene formato basico.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string} value
 * @returns {boolean}
 */
export const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ''));

/**
 * Envia un error en formato JSON.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Response} res
 * @param {number} status
 * @param {string} message
 * @returns {import('express').Response}
 */
export const sendError = (res, status, message) => res.status(status).json({ message });

/**
 * Lee el payload del JWT de Authorization.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @returns {Record<string, any> | null}
 */
export const getJwtPayload = (req) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || typeof authHeader !== 'string') {
    return null;
  }
  const [scheme, token] = authHeader.split(' ');
  if (String(scheme).toLowerCase() !== 'bearer' || !token) {
    return null;
  }
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch {
    return null;
  }
};

/**
 * Lee el rol desde headers o body o query.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @returns {string}
 */
export const getRequestRole = (req) =>
  getJwtPayload(req)?.role || req.headers['x-user-role'] || req.body?.role || req.query?.role || 'guest';

/**
 * Lee el userId desde headers o body o query.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @returns {number | null}
 */
export const getRequestUserId = (req) => {
  const rawId = getJwtPayload(req)?.id || req.headers['x-user-id'] || req.body?.userId || req.query?.userId;
  const parsedId = parseId(rawId);
  return Number.isNaN(parsedId) ? null : parsedId;
};

/**
 * Lee el orgId desde headers o body o query.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @returns {number | null}
 */
export const getRequestOrgId = (req) => {
  const rawId =
    getJwtPayload(req)?.orgId || req.headers['x-org-id'] || req.body?.orgId || req.query?.orgId;
  const parsedId = parseId(rawId);
  return Number.isNaN(parsedId) ? null : parsedId;
};
