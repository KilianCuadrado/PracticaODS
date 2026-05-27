import {
  createNewUser,
  deleteUserById,
  getUserById,
  getUserEvents,
  getUserOngRequests,
  getUsers,
  updateUserById,
} from '../controllers/usersController.js';

/**
 * Registra rutas de usuarios.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Application} app
 * @returns {void}
 */
export const registerUserRoutes = (app) => {
  app.get('/api/users', getUsers);
  app.get('/api/users/:id', getUserById);
  app.post('/api/users', createNewUser);
  app.put('/api/users/:id', updateUserById);
  app.delete('/api/users/:id', deleteUserById);
  app.get('/api/users/:id/events', getUserEvents);
  app.get('/api/users/:id/ong-requests', getUserOngRequests);
  app.get('/api/users/:id/org-requests', getUserOngRequests);
};
