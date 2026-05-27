/**
 * Valida formato basico de email.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string} emailValue
 * @returns {boolean}
 */
export const isValidEmail = (emailValue) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(emailValue || ''));

/**
 * Comprueba longitud minima.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} value
 * @param {number} minLength
 * @returns {boolean}
 */
export const hasMinLength = (value, minLength) => String(value || '').trim().length >= minLength;

/**
 * Comprueba longitud maxima.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} value
 * @param {number} maxLength
 * @returns {boolean}
 */
export const hasMaxLength = (value, maxLength) => String(value || '').trim().length <= maxLength;

/**
 * Valida url con protocolo http o https.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string} urlValue
 * @returns {boolean}
 */
export const isValidUrl = (urlValue) => {
  const rawValue = String(urlValue || '').trim();
  if (!rawValue) {
    return false;
  }
  try {
    const parsedUrl = new URL(rawValue);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Valida si la fecha es hoy o futura.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string} dateValue
 * @returns {boolean}
 */
export const isFutureOrToday = (dateValue) => {
  const rawDate = String(dateValue || '').trim();
  if (!rawDate) {
    return false;
  }
  const parsedDate = new Date(`${rawDate}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parsedDate >= today;
};

/**
 * Verifica que todos los campos tengan valor.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Array<string | number>} values
 * @returns {boolean}
 */
export const requiredFieldsFilled = (values) => values.every((value) => String(value || '').trim().length > 0);
