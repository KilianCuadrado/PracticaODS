import {
  createNewOng,
  deleteOngById,
  getOngById,
  getOngRequests,
  getOngs,
  requestJoinOng,
  resolveOngJoinRequest,
  updateOngById,
  updateOngStatusById,
} from '../controllers/ongsController.js';

/**
 * Registra rutas de ONGs.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Application} app
 * @returns {void}
 */
export const registerOngRoutes = (app) => {
  app.get('/api/ongs', getOngs);
  app.get('/api/ongs/:id', getOngById);
  app.post('/api/ongs', createNewOng);
  app.put('/api/ongs/:id', updateOngById);
  app.delete('/api/ongs/:id', deleteOngById);
  app.patch('/api/ongs/:id/status', updateOngStatusById);
  app.post('/api/ongs/:id/join-requests', requestJoinOng);
  app.get('/api/ongs/:id/join-requests', getOngRequests);
  app.patch('/api/ongs/:ongId/join-requests/:requestId', resolveOngJoinRequest);

  app.get('/api/orgs', getOngs);
  app.get('/api/orgs/:id', getOngById);
  app.post('/api/orgs', createNewOng);
  app.put('/api/orgs/:id', updateOngById);
  app.delete('/api/orgs/:id', deleteOngById);
  app.patch('/api/orgs/:id/status', updateOngStatusById);
  app.post('/api/orgs/:id/join-requests', requestJoinOng);
  app.get('/api/orgs/:id/join-requests', getOngRequests);
  app.patch('/api/orgs/:orgId/join-requests/:requestId', resolveOngJoinRequest);
};
