import {
  createNewResource,
  deleteResourceById,
  getResourceById,
  getResources,
  updateResourceById,
} from '../controllers/resourcesController.js';

/**
 * Registra rutas de recursos.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Application} app
 * @returns {void}
 */
export const registerResourceRoutes = (app) => {
  app.get('/api/resources', getResources);
  app.get('/api/resources/:id', getResourceById);
  app.post('/api/resources', createNewResource);
  app.put('/api/resources/:id', updateResourceById);
  app.delete('/api/resources/:id', deleteResourceById);
};
