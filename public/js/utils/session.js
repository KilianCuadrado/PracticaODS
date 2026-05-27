/**
 * Lee el usuario guardado en sessionStorage.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {Record<string, any> | null}
 */
export const getSessionUser = () => {
  const rawValue = sessionStorage.getItem('sessionUser');
  if (!rawValue) {
    return null;
  }
  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
};

/**
 * Guarda el usuario en sessionStorage.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Record<string, any>} userData
 * @returns {void}
 */
export const setSessionUser = (userData) => {
  sessionStorage.setItem('sessionUser', JSON.stringify(userData));
};

/**
 * Devuelve el token JWT guardado en la sesion.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {string}
 */
export const getSessionToken = () => {
  const sessionUser = getSessionUser();
  return sessionUser && sessionUser.token ? String(sessionUser.token) : '';
};

/**
 * Crea headers JSON con JWT si existe.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {Record<string, string>}
 */
export const buildAuthHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = getSessionToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Limpia el usuario de sessionStorage.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {void}
 */
export const clearSessionUser = () => {
  sessionStorage.removeItem('sessionUser');
};
