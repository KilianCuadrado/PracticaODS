import {
  createOng,
  createOngJoinRequest,
  deleteOng,
  findOngById,
  findOngByName,
  listOngRequests,
  listOngs,
  resolveOngRequest,
  updateOng,
  updateOngStatus,
} from '../models/ongsModel.js';
import { findUserById } from '../models/usersModel.js';
import { parseId, sendError } from '../utils/http.js';

/**
 * Listado de ONGs.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const getOngs = (req, res) => {
  const status = req.query?.status;
  const ongs = listOngs(status);
  return res.json(ongs);
};

/**
 * Detalle de ONG.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const getOngById = (req, res) => {
  const ongId = parseId(req.params.id);
  if (Number.isNaN(ongId)) {
    return sendError(res, 400, 'ID de ONG no válido');
  }
  const ong = findOngById(ongId);
  if (!ong) {
    return sendError(res, 404, 'ONG no encontrada');
  }
  return res.json(ong);
};

/**
 * Crear ONG directa.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const createNewOng = (req, res) => {
  const name = req.body?.name;
  const description = req.body?.description;

  if (!name || !description) {
    return sendError(res, 400, 'name y description son obligatorios');
  }

  const existingOng = findOngByName(name);
  if (existingOng) {
    return sendError(res, 409, 'Ya existe una ONG con ese nombre');
  }

  const newOng = createOng({
    name,
    description,
    image: req.body?.image || '',
    url: req.body?.url || '',
    contactEmail: req.body?.contactEmail || '',
    ownerUserId: req.body?.ownerUserId || null,
    status: req.body?.status || 'approved',
  });

  return res.status(201).json(newOng);
};

/**
 * Actualizar ONG.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const updateOngById = (req, res) => {
  const ongId = parseId(req.params.id);
  if (Number.isNaN(ongId)) {
    return sendError(res, 400, 'ID de ONG no válido');
  }

  const currentOng = findOngById(ongId);
  if (!currentOng) {
    return sendError(res, 404, 'ONG no encontrada');
  }

  const updatedOng = updateOng(ongId, {
    name: req.body?.name,
    description: req.body?.description,
    image: req.body?.image,
    url: req.body?.url,
    contactEmail: req.body?.contactEmail,
  });

  return res.json(updatedOng);
};

/**
 * Eliminar ONG.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const deleteOngById = (req, res) => {
  const ongId = parseId(req.params.id);
  if (Number.isNaN(ongId)) {
    return sendError(res, 400, 'ID de ONG no válido');
  }

  const deletedOng = deleteOng(ongId);
  if (!deletedOng) {
    return sendError(res, 404, 'ONG no encontrada');
  }

  return res.json({ message: 'ONG eliminada', ong: deletedOng });
};

/**
 * Cambiar estado de ONG.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const updateOngStatusById = (req, res) => {
  const ongId = parseId(req.params.id);
  const status = req.body?.status;
  if (Number.isNaN(ongId)) {
    return sendError(res, 400, 'ID de ONG no válido');
  }
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return sendError(res, 400, 'status debe ser pending, approved o rejected');
  }

  const updatedOng = updateOngStatus(ongId, status);
  if (!updatedOng) {
    return sendError(res, 404, 'ONG no encontrada');
  }

  return res.json(updatedOng);
};

/**
 * Solicitar unirse a una ONG.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const requestJoinOng = (req, res) => {
  const ongId = parseId(req.params.id);
  const userId = parseId(req.body?.userId);
  if (Number.isNaN(ongId) || Number.isNaN(userId)) {
    return sendError(res, 400, 'ongId y userId deben ser válidos');
  }

  const orgExists = findOngById(ongId);
  const userExists = findUserById(userId);
  if (!orgExists || !userExists) {
    return sendError(res, 404, 'ONG o usuario no encontrado');
  }

  const requests = listOngRequests(ongId);
  for (let i = 0; i < requests.length; i += 1) {
    if (Number(requests[i].userId) === Number(userId) && requests[i].status === 'pending') {
      return sendError(res, 409, 'Ya existe una solicitud pendiente para esta ONG');
    }
  }

  const newRequest = createOngJoinRequest(ongId, userId);
  return res.status(201).json(newRequest);
};

/**
 * Listar solicitudes de ONG.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const getOngRequests = (req, res) => {
  const ongId = parseId(req.params.id);
  if (Number.isNaN(ongId)) {
    return sendError(res, 400, 'ID de ONG no válido');
  }
  const requests = listOngRequests(ongId);
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
export const resolveOngJoinRequest = (req, res) => {
  const ongId = parseId(req.params.orgId);
  const requestId = parseId(req.params.requestId);
  const status = req.body?.status;
  if (Number.isNaN(ongId) || Number.isNaN(requestId)) {
    return sendError(res, 400, 'ongId y requestId deben ser válidos');
  }
  if (!['approved', 'rejected'].includes(status)) {
    return sendError(res, 400, 'status debe ser approved o rejected');
  }

  const updatedRequest = resolveOngRequest(ongId, requestId, status);
  if (!updatedRequest) {
    return sendError(res, 404, 'Solicitud no encontrada');
  }

  return res.json(updatedRequest);
};
