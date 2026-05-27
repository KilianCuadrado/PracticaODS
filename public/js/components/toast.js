/**
 * Obtiene o crea el contenedor de toasts.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {HTMLElement}
 */
const getToastContainer = () => {
  let container = document.getElementById('appToastContainer');
  if (container) {
    return container;
  }

  container = document.createElement('div');
  container.id = 'appToastContainer';
  container.className = 'toast-container position-fixed top-0 end-0 p-3';
  container.setAttribute('aria-live', 'polite');
  container.setAttribute('aria-atomic', 'true');
  document.body.appendChild(container);
  return container;
};

/**
 * Devuelve estilos segun tipo de toast.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string} type
 * @returns {{ className: string, title: string }}
 */
const getToastStylesByType = (type) => {
  if (type === 'success') {
    return { className: 'text-bg-success', title: 'Correcto' };
  }
  if (type === 'error') {
    return { className: 'text-bg-danger', title: 'Error' };
  }
  if (type === 'warning') {
    return { className: 'text-bg-warning', title: 'Aviso' };
  }
  return { className: 'text-bg-primary', title: 'Info' };
};

/**
 * Muestra un toast en pantalla.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {{ message: string, type?: string, delay?: number }} payload
 * @returns {void}
 */
export const showToast = ({ message, type = 'info', delay = 3500 } = {}) => {
  const toastMessage = String(message || '').trim();
  if (!toastMessage) {
    return;
  }

  const { className, title } = getToastStylesByType(type);
  const container = getToastContainer();
  const toastElement = document.createElement('div');
  toastElement.className = `toast ${className} border-0`;
  toastElement.setAttribute('role', 'alert');
  toastElement.setAttribute('aria-live', 'assertive');
  toastElement.setAttribute('aria-atomic', 'true');
  toastElement.innerHTML = `
    <div class="toast-header">
      <strong class="me-auto">${title}</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">${toastMessage}</div>
  `;
  container.appendChild(toastElement);

  if (window.bootstrap?.Toast) {
    const toast = new window.bootstrap.Toast(toastElement, { delay });
    toast.show();
    toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove(), { once: true });
    return;
  }

  toastElement.classList.add('show');
  window.setTimeout(() => toastElement.remove(), delay);
};
