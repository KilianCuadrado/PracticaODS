import { login, registerOng, registerUser } from '../controllers/authController.js';

/**
 * Registra rutas de autenticacion.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Application} app
 * @returns {void}
 */
export const registerAuthRoutes = (app) => {
  app.post('/api/auth/register-user', registerUser);
  app.post('/api/auth/register-ong', registerOng);
  app.post('/api/auth/register-org', registerOng);
  app.post('/api/auth/login', login);
};
