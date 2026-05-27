import {
  createUser,
  deleteUser,
  findUserByEmail,
  findUserById,
  listUserEvents,
  listUserOrgRequests,
  listUsers,
  updateUser,
} from '../models/usersModel.js';
import { isValidEmail, parseId, sendError } from '../utils/http.js';

/**
 * Listado de usuarios.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const getUsers = (req, res) => {
  const users = listUsers();
  return res.json(users);
};

/**
 * Detalle de usuario.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const getUserById = (req, res) => {
  const userId = parseId(req.params.id);
  if (Number.isNaN(userId)) {
    return sendError(res, 400, 'ID de usuario no válido');
  }
  const user = findUserById(userId);
  if (!user) {
    return sendError(res, 404, 'Usuario no encontrado');
  }
  return res.json(user);
};

/**
 * Crear usuario desde admin.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const createNewUser = (req, res) => {
  const username = req.body?.username;
  const email = req.body?.email;
  const password = req.body?.password;
  const role = req.body?.role || 'user';

  if (!username || !email || !password) {
    return sendError(res, 400, 'username, email y password son obligatorios');
  }
  if (!isValidEmail(email)) {
    return sendError(res, 400, 'email no válido');
  }

  const existingUser = findUserByEmail(email);
  if (existingUser) {
    return sendError(res, 409, 'El email ya está registrado');
  }

  const newUser = createUser({
    username,
    email,
    password,
    role: String(role) === 'admin' ? 'admin' : 'user',
    orgId: null,
  });

  return res.status(201).json(newUser);
};

/**
 * Actualizar usuario.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const updateUserById = (req, res) => {
  const userId = parseId(req.params.id);
  if (Number.isNaN(userId)) {
    return sendError(res, 400, 'ID de usuario no válido');
  }

  const currentUser = findUserById(userId);
  if (!currentUser) {
    return sendError(res, 404, 'Usuario no encontrado');
  }

  const email = req.body?.email;
  if (email && !isValidEmail(email)) {
    return sendError(res, 400, 'email no válido');
  }

  if (email) {
    const users = listUsers();
    for (let i = 0; i < users.length; i += 1) {
      if (
        Number(users[i].id) !== Number(userId) &&
        String(users[i].email).toLowerCase() === String(email).toLowerCase()
      ) {
        return sendError(res, 409, 'Ese email ya está en uso');
      }
    }
  }

  const updatedUser = updateUser(userId, {
    username: req.body?.username,
    email: req.body?.email,
    password: req.body?.password,
    role: req.body?.role,
    orgId: req.body?.orgId,
  });

  return res.json(updatedUser);
};

/**
 * Borrar usuario.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const deleteUserById = (req, res) => {
  const userId = parseId(req.params.id);
  if (Number.isNaN(userId)) {
    return sendError(res, 400, 'ID de usuario no válido');
  }

  const deletedUser = deleteUser(userId);
  if (!deletedUser) {
    return sendError(res, 404, 'Usuario no encontrado');
  }

  return res.json({ message: 'Usuario eliminado', user: deletedUser });
};

/**
 * Eventos de un usuario.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const getUserEvents = (req, res) => {
  const userId = parseId(req.params.id);
  if (Number.isNaN(userId)) {
    return sendError(res, 400, 'ID de usuario no válido');
  }
  const events = listUserEvents(userId);
  return res.json(events);
};

/**
 * Solicitudes de ORG de un usuario.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const getUserOrgRequests = (req, res) => {
  const userId = parseId(req.params.id);
  if (Number.isNaN(userId)) {
    return sendError(res, 400, 'ID de usuario no válido');
  }
  const requests = listUserOrgRequests(userId);
  return res.json(requests);
};
