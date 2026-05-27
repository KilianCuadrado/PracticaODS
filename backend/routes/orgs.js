import {
  createNewOrg,
  deleteOrgById,
  getOrgById,
  getOrgRequests,
  getOrgs,
  requestJoinOrg,
  resolveOrgJoinRequest,
  updateOrgById,
  updateOrgStatusById,
} from '../controllers/orgsController.js';

/**
 * Registra rutas de organizaciones.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Application} app
 * @returns {void}
 */
export const registerOrgRoutes = (app) => {
  app.get('/api/orgs', getOrgs);
  app.get('/api/orgs/:id', getOrgById);
  app.post('/api/orgs', createNewOrg);
  app.put('/api/orgs/:id', updateOrgById);
  app.delete('/api/orgs/:id', deleteOrgById);
  app.patch('/api/orgs/:id/status', updateOrgStatusById);
  app.post('/api/orgs/:id/join-requests', requestJoinOrg);
  app.get('/api/orgs/:id/join-requests', getOrgRequests);
  app.patch('/api/orgs/:orgId/join-requests/:requestId', resolveOrgJoinRequest);
};
