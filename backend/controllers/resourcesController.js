import {
  createResource,
  deleteResource,
  findResourceById,
  listResources,
  updateResource,
} from '../models/resourcesModel.js';
import { getRequestOrgId, getRequestRole, getRequestUserId, parseId, sendError } from '../utils/http.js';

/**
 * Listado de recursos.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const getResources = (req, res) => {
  const filters = {
    type: req.query?.type,
    category: req.query?.category,
    status: req.query?.status,
    q: req.query?.q,
    orgId: req.query?.orgId,
    ownerUserId: req.query?.ownerUserId,
  };
  const listings = listResources(filters);
  return res.json(listings);
};

/**
 * Detalle de recurso.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const getResourceById = (req, res) => {
  const resourceId = parseId(req.params.id);
  if (Number.isNaN(resourceId)) {
    return sendError(res, 400, 'ID de recurso no valido');
  }
  const listing = findResourceById(resourceId);
  if (!listing) {
    return sendError(res, 404, 'Recurso no encontrado');
  }
  return res.json(listing);
};

/**
 * Crear recurso.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const createNewResource = (req, res) => {
  const type = req.body?.type;
  const title = req.body?.title;
  const description = req.body?.description;
  const category = req.body?.category;
  const quantity = req.body?.quantity;
  const unit = req.body?.unit;
  const location = req.body?.location;
  const condition = req.body?.condition;

  if (!type || !title || !description || !category) {
    return sendError(res, 400, 'type, title, description y category son obligatorios');
  }

  const ownerUserId = getRequestUserId(req);
  if (!ownerUserId) {
    return sendError(res, 400, 'Falta userId en la sesion');
  }

  const requesterOrgId = getRequestRole(req) === 'ong' ? getRequestOrgId(req) : null;

  const newListing = createResource({
    type,
    title,
    description,
    category,
    quantity,
    unit,
    location,
    condition,
    ownerUserId,
    orgId: requesterOrgId || null,
    status: 'open',
  });

  return res.status(201).json(newListing);
};

/**
 * Actualizar recurso.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const updateResourceById = (req, res) => {
  const resourceId = parseId(req.params.id);
  if (Number.isNaN(resourceId)) {
    return sendError(res, 400, 'ID de recurso no valido');
  }

  const currentListing = findResourceById(resourceId);
  if (!currentListing) {
    return sendError(res, 404, 'Recurso no encontrado');
  }

  const updatedListing = updateResource(resourceId, {
    type: req.body?.type,
    title: req.body?.title,
    description: req.body?.description,
    category: req.body?.category,
    quantity: req.body?.quantity,
    unit: req.body?.unit,
    location: req.body?.location,
    condition: req.body?.condition,
    status: req.body?.status,
  });

  return res.json(updatedListing);
};

/**
 * Borrar recurso.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {import('express').Response}
 */
export const deleteResourceById = (req, res) => {
  const resourceId = parseId(req.params.id);
  if (Number.isNaN(resourceId)) {
    return sendError(res, 400, 'ID de recurso no valido');
  }

  const deletedListing = deleteResource(resourceId);
  if (!deletedListing) {
    return sendError(res, 404, 'Recurso no encontrado');
  }

  return res.json({ message: 'Recurso eliminado', resource: deletedListing });
};
