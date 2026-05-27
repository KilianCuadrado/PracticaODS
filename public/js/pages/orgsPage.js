import { getOngs, requestJoinOng } from '../api/orgsApi.js';
import { showToast } from '../components/toast.js';
import { getSessionUser } from '../utils/session.js';

const orgsList = document.getElementById('orgsList');

/**
 * Calcula el estado del boton de union.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Record<string, any> | null} currentUser
 * @param {Record<string, any>} orgItem
 * @returns {{ label: string, disabled: boolean }}
 */
const getJoinButtonState = (currentUser, orgItem) => {
  if (!currentUser) {
    return { label: 'Solicitar unión', disabled: false };
  }
  if (currentUser.ownedOrgId) {
    return { label: 'Ya tienes una ONG', disabled: true };
  }
  if (currentUser.orgId) {
    const isSameOrg = Number(currentUser.orgId) === Number(orgItem.id);
    return {
      label: isSameOrg ? 'Ya eres miembro' : 'Ya perteneces a una ONG',
      disabled: true,
    };
  }
  return { label: 'Solicitar unión', disabled: false };
};

/**
 * Renderiza las orgs en pantalla.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Array<Record<string, any>>} orgs
 * @param {Record<string, any> | null} currentUser
 * @returns {void}
 */
const renderOrgs = (orgs, currentUser) => {
  if (!orgsList) {
    return;
  }
  if (orgs.length === 0) {
    orgsList.innerHTML = '<p class="text-muted">No hay ONGs aprobadas.</p>';
    return;
  }
  orgsList.innerHTML = orgs
    .map(
      (orgItem) => {
        const buttonState = getJoinButtonState(currentUser, orgItem);
        return `
      <article class="card cardFeature p-3">
        <h3 class="h5">${orgItem.name || orgItem.nom}</h3>
        <p>${orgItem.description}</p>
        ${
          orgItem.url
            ? `<p><a href="${orgItem.url}" target="_blank" rel="noopener noreferrer">Web de la ONG</a></p>`
            : ''
        }
        <button class="btn btn-outline-success joinOrgBtn" data-org-id="${orgItem.id}" ${buttonState.disabled ? 'disabled' : ''}>
          ${buttonState.label}
        </button>
      </article>
    `;
      },
    )
    .join('');
};

/**
 * Asigna acciones a botones de union.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {void}
 */
const bindJoinOrgButtons = () => {
  const buttons = document.querySelectorAll('.joinOrgBtn');
  buttons.forEach((button) => {
    button.addEventListener('click', async () => {
      if (button.disabled) {
        return;
      }
      const currentUser = getSessionUser();
      if (!currentUser) {
        showToast({ message: 'Debes iniciar sesión para solicitar unión a una ONG', type: 'warning' });
        return;
      }
      try {
        await requestJoinOng(button.dataset.orgId, currentUser.id);
        showToast({ message: 'Solicitud enviada', type: 'success' });
      } catch (error) {
        showToast({ message: error.message, type: 'error' });
      }
    });
  });
};

/**
 * Inicializa la vista de orgs.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {Promise<void>}
 */
const initOrgsPage = async () => {
  try {
    const currentUser = getSessionUser();
    const orgs = await getOngs('approved');
    renderOrgs(orgs, currentUser);
    bindJoinOrgButtons();
  } catch (error) {
    if (orgsList) {
      orgsList.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
  }
};

document.addEventListener('DOMContentLoaded', initOrgsPage);
