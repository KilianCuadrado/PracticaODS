/**
 * Carga un include html en el elemento.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {HTMLElement} element
 * @returns {Promise<void>}
 * @throws {Error} Cuando el include no se puede cargar.
 */
const loadInclude = async (element) => {
  const includePath = element.dataset.include;
  if (!includePath) {
    return;
  }
  const response = await fetch(includePath);
  if (!response.ok) {
    throw new Error(`No se pudo cargar include: ${includePath}`);
  }
  const content = await response.text();
  element.innerHTML = content;
};

/**
 * Inicializa includes y navbar cuando el DOM esta listo.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 */
document.addEventListener('DOMContentLoaded', async () => {
  const includeElements = Array.from(document.querySelectorAll('[data-include]'));
  for (const includeElement of includeElements) {
    try {
      await loadInclude(includeElement);
    } catch (error) {
      includeElement.innerHTML = `<div class="alert alert-danger">Error cargando componente</div>`;
      console.error(error);
    }
  }
  if (window.initializeNavbar) {
    window.initializeNavbar();
  }
});
