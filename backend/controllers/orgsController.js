import {
  createOrg,
  createOrgJoinRequest,
  deleteOrg,
  findOrgById,
  findOrgByName,
  listOrgRequests,
  listOrgs,
  resolveOrgRequest,
  updateOrg,
  updateOrgStatus,
} from '../models/orgsModel.js';
import { findUserById } from '../models/usersModel.js';
import { parseId, sendError } from '../utils/http.js';

/**
 * Listado de ORGs.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const getOrgs = (req, res) => {
  const status = req.query?.status;
  const orgs = listOrgs(status);
  return res.json(orgs);
};

/**
 * Detalle de ORG.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const getOrgById = (req, res) => {
  const orgId = parseId(req.params.id);
  if (Number.isNaN(orgId)) {
    return sendError(res, 400, 'ID de ORG no válido');
  }
  const org = findOrgById(orgId);
  if (!org) {
    return sendError(res, 404, 'ORG no encontrada');
  }
  return res.json(org);
};

/**
 * Crear ORG directa.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const createNewOrg = (req, res) => {
  const name = req.body?.name;
  const description = req.body?.description;

  if (!name || !description) {
    return sendError(res, 400, 'name y description son obligatorios');
  }

  const existingOrg = findOrgByName(name);
  if (existingOrg) {
    return sendError(res, 409, 'Ya existe una ORG con ese nombre');
  }

  const newOrg = createOrg({
    name,
    description,
    image: req.body?.image || '',
    url: req.body?.url || '',
    contactEmail: req.body?.contactEmail || '',
    ownerUserId: req.body?.ownerUserId || null,
    status: req.body?.status || 'approved',
  });

  return res.status(201).json(newOrg);
};

/**
 * Actualizar ORG.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const updateOrgById = (req, res) => {
  const orgId = parseId(req.params.id);
  if (Number.isNaN(orgId)) {
    return sendError(res, 400, 'ID de ORG no válido');
  }

  const currentOrg = findOrgById(orgId);
  if (!currentOrg) {
    return sendError(res, 404, 'ORG no encontrada');
  }

  const updatedOrg = updateOrg(orgId, {
    name: req.body?.name,
    description: req.body?.description,
    image: req.body?.image,
    url: req.body?.url,
    contactEmail: req.body?.contactEmail,
  });

  return res.json(updatedOrg);
};

/**
 * Eliminar ORG.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const deleteOrgById = (req, res) => {
  const orgId = parseId(req.params.id);
  if (Number.isNaN(orgId)) {
    return sendError(res, 400, 'ID de ORG no válido');
  }

  const deletedOrg = deleteOrg(orgId);
  if (!deletedOrg) {
    return sendError(res, 404, 'ORG no encontrada');
  }

  return res.json({ message: 'ORG eliminada', org: deletedOrg });
};

/**
 * Cambiar estado de ORG.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const updateOrgStatusById = (req, res) => {
  const orgId = parseId(req.params.id);
  const status = req.body?.status;
  if (Number.isNaN(orgId)) {
    return sendError(res, 400, 'ID de ORG no válido');
  }
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return sendError(res, 400, 'status debe ser pending, approved o rejected');
  }

  const updatedOrg = updateOrgStatus(orgId, status);
  if (!updatedOrg) {
    return sendError(res, 404, 'ORG no encontrada');
  }

  return res.json(updatedOrg);
};

/**
 * Solicitar unirse a una ORG.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const requestJoinOrg = (req, res) => {
  const orgId = parseId(req.params.id);
  const userId = parseId(req.body?.userId);
  if (Number.isNaN(orgId) || Number.isNaN(userId)) {
    return sendError(res, 400, 'orgId y userId deben ser válidos');
  }

  const orgExists = findOrgById(orgId);
  const userExists = findUserById(userId);
  if (!orgExists || !userExists) {
    return sendError(res, 404, 'ORG o usuario no encontrado');
  }

  const requests = listOrgRequests(orgId);
  for (let i = 0; i < requests.length; i += 1) {
    if (Number(requests[i].userId) === Number(userId) && requests[i].status === 'pending') {
      return sendError(res, 409, 'Ya existe una solicitud pendiente para esta ORG');
    }
  }

  const newRequest = createOrgJoinRequest(orgId, userId);
  return res.status(201).json(newRequest);
};

/**
 * Listar solicitudes de ORG.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const getOrgRequests = (req, res) => {
  const orgId = parseId(req.params.id);
  if (Number.isNaN(orgId)) {
    return sendError(res, 400, 'ID de ORG no válido');
  }
  const requests = listOrgRequests(orgId);
  return res.json(requests);
};

/**
 * Aprobar o rechazar solicitud.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const resolveOrgJoinRequest = (req, res) => {
  const orgId = parseId(req.params.orgId);
  const requestId = parseId(req.params.requestId);
  const status = req.body?.status;
  if (Number.isNaN(orgId) || Number.isNaN(requestId)) {
    return sendError(res, 400, 'orgId y requestId deben ser válidos');
  }
  if (!['approved', 'rejected'].includes(status)) {
    return sendError(res, 400, 'status debe ser approved o rejected');
  }

  const updatedRequest = resolveOrgRequest(orgId, requestId, status);
  if (!updatedRequest) {
    return sendError(res, 404, 'Solicitud no encontrada');
  }

  return res.json(updatedRequest);
};
