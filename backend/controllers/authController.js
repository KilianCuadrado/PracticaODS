import { createUser, findUserByEmail, findUserById } from '../models/usersModel.js';
import { createOrg, findOrgByName, findOrgByOwnerId } from '../models/orgsModel.js';
import { isValidEmail, parseId, sendError } from '../utils/http.js';

/**
 * Registro de usuario normal.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
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

  const newUser = createUser({
    username,
    email,
    password,
    role: 'user',
    orgId: null,
  });

  return res.status(201).json({ message: 'Usuario registrado', user: newUser });
};

/**
 * Registro de ORG con estado pending.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const registerOrg = (req, res) => {
  const orgName = req.body?.orgName;
  const description = req.body?.description;
  const contactEmail = req.body?.contactEmail;
  const image = req.body?.image || '';
  const url = req.body?.url || '';
  const adminUserId = req.body?.adminUserId;

  if (!orgName || !description || !contactEmail || !adminUserId) {
    return sendError(res, 400, 'orgName, description, contactEmail y adminUserId son obligatorios');
  }
  if (!isValidEmail(contactEmail)) {
    return sendError(res, 400, 'contactEmail no válido');
  }

  const orgExists = findOrgByName(orgName);
  if (orgExists) {
    return sendError(res, 409, 'Ya existe una ORG con ese nombre');
  }

  const adminId = parseId(adminUserId);
  if (Number.isNaN(adminId)) {
    return sendError(res, 400, 'adminUserId no válido');
  }

  const adminUser = findUserById(adminId);
  if (!adminUser) {
    return sendError(res, 404, 'No existe el usuario administrador de la ORG');
  }

  const newOrg = createOrg({
    name: orgName,
    description,
    image,
    url,
    contactEmail: String(contactEmail).trim().toLowerCase(),
    ownerUserId: adminId,
    status: 'pending',
  });

  return res.status(201).json({ message: 'Solicitud de ORG enviada', org: newOrg });
};

/**
 * Login simple contra el JSON.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const login = (req, res) => {
  const email = req.body?.email;
  const password = req.body?.password;

  if (!email || !password) {
    return sendError(res, 400, 'email y password son obligatorios');
  }

  const user = findUserByEmail(email);
  if (!user || String(user.password) !== String(password)) {
    return sendError(res, 401, 'Credenciales inválidas');
  }

  const ownedOrg = findOrgByOwnerId(user.id);
  const sessionRole =
    ownedOrg && ownedOrg.status === 'approved' ? 'org' : user.role || 'user';

  return res.status(200).json({
    message: 'Login correcto',
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: sessionRole,
      baseRole: user.role || 'user',
      orgId: user.orgId || null,
      ownedOrgId: ownedOrg ? ownedOrg.id : null,
      ownedOrgStatus: ownedOrg ? ownedOrg.status : null,
    },
  });
};
