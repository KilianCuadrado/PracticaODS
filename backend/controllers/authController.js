import { createUser, findUserByEmail, findUserById } from '../models/usersModel.js';
import { createOng, findOngByName, findOngByOwnerId } from '../models/ongsModel.js';
import { isValidEmail, parseId, sendError } from '../utils/http.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config.js';

/**
 * Registro de usuario normal (ahora con hash de contraseña).
 */
export const registerUser = (req, res) => {
  const username = req.body?.username;
  const email = req.body?.email;
  const password = req.body?.password;

  if (!username || !email || !password) {
    return sendError(res, 400, 'username, email y password son obligatorios');
  }
  if (!isValidEmail(email)) {
    return sendError(res, 400, 'email no válido');
  }

  const existingUser = findUserByEmail(email);
  if (existingUser) {
    return sendError(res, 409, 'Ya existe un usuario con ese email');
  }

  const hashed = bcrypt.hashSync(String(password), 10);

  const newUser = createUser({
    username,
    email,
    password: hashed,
    role: 'user',
    orgId: null,
  });

  // Remove password before returning
  const safeUser = {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
    orgId: newUser.orgId,
  };

  return res.status(201).json({ message: 'Usuario registrado', user: safeUser });
};

/**
 * Registro de ORG con estado pending.
 */
export const registerOng = (req, res) => {
  const ongName = req.body?.ongName;
  const description = req.body?.description;
  const contactEmail = req.body?.contactEmail;
  const image = req.body?.image || '';
  const url = req.body?.url || '';
  const adminUserId = req.body?.adminUserId;

  if (!ongName || !description || !contactEmail || !adminUserId) {
    return sendError(res, 400, 'ongName, description, contactEmail y adminUserId son obligatorios');
  }
  if (!isValidEmail(contactEmail)) {
    return sendError(res, 400, 'contactEmail no válido');
  }

  const ongExists = findOngByName(ongName);
  if (ongExists) {
    return sendError(res, 409, 'Ya existe una ONG con ese nombre');
  }

  const adminId = parseId(adminUserId);
  if (Number.isNaN(adminId)) {
    return sendError(res, 400, 'adminUserId no válido');
  }

  const adminUser = findUserById(adminId);
  if (!adminUser) {
    return sendError(res, 404, 'No existe el usuario administrador de la ONG');
  }

  const newOng = createOng({
    name: ongName,
    description,
    image,
    url,
    contactEmail: String(contactEmail).trim().toLowerCase(),
    ownerUserId: adminId,
    status: 'pending',
  });

  return res.status(201).json({ message: 'Solicitud de ONG enviada', ong: newOng });
};

/**
 * Login con verificación de hash y emisión de JWT.
 */
export const login = (req, res) => {
  const email = req.body?.email;
  const password = req.body?.password;

  if (!email || !password) {
    return sendError(res, 400, 'email y password son obligatorios');
  }

  const user = findUserByEmail(email);
  const passwordMatches =
    bcrypt.compareSync(String(password), String(user.password)) ||
    String(password) === String(user.password);

  if (!user || !passwordMatches) {
    return sendError(res, 401, 'Credenciales inválidas');
  }

  const ownedOng = findOngByOwnerId(user.id);
  const sessionRole =
    ownedOng && ownedOng.status === 'approved' ? 'ong' : user.role || 'user';

  const tokenPayload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: sessionRole,
    orgId: ownedOng && ownedOng.status === 'approved' ? ownedOng.id : null,
  };

  const token = jwt.sign(tokenPayload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });

  const safeUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: sessionRole,
    baseRole: user.role || 'user',
    orgId: user.orgId || null,
    ownedOrgId: ownedOng ? ownedOng.id : null,
    ownedOrgStatus: ownedOng ? ownedOng.status : null,
  };

  return res.status(200).json({
    message: 'Login correcto',
    token,
    user: safeUser,
  });
};
