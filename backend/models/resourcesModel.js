import { nextId, readDb, writeDb } from './db.js';

/**
 * Lista recursos con filtros opcionales.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Record<string, any>} filters
 * @returns {Array<Record<string, any>>}
 */
export const listResources = (filters) => {
  const type = filters?.type;
  const category = filters?.category;
  const status = filters?.status;
  const q = filters?.q;
  const orgId = filters?.orgId;
  const ownerUserId = filters?.ownerUserId;

  const db = readDb();
  let listings = db.resourceListings.slice();

  if (type) {
    listings = listings.filter((listing) => String(listing.type) === String(type));
  }
  if (status) {
    listings = listings.filter((listing) => String(listing.status) === String(status));
  }
  if (category) {
    const normalizedCategory = String(category).toLowerCase();
    listings = listings.filter(
      (listing) => String(listing.category || '').toLowerCase() === normalizedCategory,
    );
  }
  if (orgId) {
    const parsedOrgId = Number(orgId);
    if (!Number.isNaN(parsedOrgId)) {
      listings = listings.filter((listing) => Number(listing.orgId) === parsedOrgId);
    }
  }
  if (ownerUserId) {
    const parsedOwnerId = Number(ownerUserId);
    if (!Number.isNaN(parsedOwnerId)) {
      listings = listings.filter((listing) => Number(listing.ownerUserId) === parsedOwnerId);
    }
  }
  if (q) {
    const normalizedQuery = String(q).toLowerCase();
    listings = listings.filter((listing) => {
      const values = [listing.title, listing.description, listing.category, listing.location];
      for (let i = 0; i < values.length; i += 1) {
        if (String(values[i] || '').toLowerCase().includes(normalizedQuery)) {
          return true;
        }
      }
      return false;
    });
  }

  return listings;
};

/**
 * Busca un recurso por id.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} resourceId
 * @returns {Record<string, any> | null}
 */
export const findResourceById = (resourceId) => {
  const db = readDb();
  for (let i = 0; i < db.resourceListings.length; i += 1) {
    if (Number(db.resourceListings[i].id) === Number(resourceId)) {
      return db.resourceListings[i];
    }
  }
  return null;
};

/**
 * Crea un recurso.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Record<string, any>} payload
 * @returns {Record<string, any>}
 */
export const createResource = (payload) => {
  const db = readDb();
  const newListing = {
    id: nextId(db.resourceListings),
    type: String(payload.type),
    title: String(payload.title).trim(),
    description: String(payload.description).trim(),
    category: String(payload.category).trim(),
    quantity: payload.quantity !== undefined && payload.quantity !== null ? Number(payload.quantity) : null,
    unit: payload.unit ? String(payload.unit).trim() : '',
    location: payload.location ? String(payload.location).trim() : '',
    condition: payload.condition ? String(payload.condition).trim() : '',
    ownerUserId: payload.ownerUserId,
    orgId: payload.orgId || null,
    status: payload.status || 'open',
    createdAt: payload.createdAt || new Date().toISOString(),
  };
  db.resourceListings.push(newListing);
  writeDb(db);
  return newListing;
};

/**
 * Actualiza un recurso.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} resourceId
 * @param {Record<string, any>} payload
 * @returns {Record<string, any> | null}
 */
export const updateResource = (resourceId, payload) => {
  const db = readDb();
  let listingIndex = -1;
  for (let i = 0; i < db.resourceListings.length; i += 1) {
    if (Number(db.resourceListings[i].id) === Number(resourceId)) {
      listingIndex = i;
      break;
    }
  }
  if (listingIndex === -1) {
    return null;
  }

  const currentListing = db.resourceListings[listingIndex];
  const updatedListing = {
    id: currentListing.id,
    type: payload.type !== undefined ? String(payload.type) : currentListing.type,
    title: payload.title !== undefined ? String(payload.title).trim() : currentListing.title,
    description:
      payload.description !== undefined
        ? String(payload.description).trim()
        : currentListing.description,
    category: payload.category !== undefined ? String(payload.category).trim() : currentListing.category,
    quantity: payload.quantity !== undefined ? Number(payload.quantity) : currentListing.quantity,
    unit: payload.unit !== undefined ? String(payload.unit).trim() : currentListing.unit,
    location: payload.location !== undefined ? String(payload.location).trim() : currentListing.location,
    condition: payload.condition !== undefined ? String(payload.condition).trim() : currentListing.condition,
    ownerUserId: currentListing.ownerUserId,
    orgId: currentListing.orgId,
    status: payload.status !== undefined ? String(payload.status) : currentListing.status,
    createdAt: currentListing.createdAt,
  };

  db.resourceListings[listingIndex] = updatedListing;
  writeDb(db);
  return updatedListing;
};

/**
 * Elimina un recurso.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} resourceId
 * @returns {Record<string, any> | null}
 */
export const deleteResource = (resourceId) => {
  const db = readDb();
  let listingIndex = -1;
  for (let i = 0; i < db.resourceListings.length; i += 1) {
    if (Number(db.resourceListings[i].id) === Number(resourceId)) {
      listingIndex = i;
      break;
    }
  }
  if (listingIndex === -1) {
    return null;
  }

  const deletedListing = db.resourceListings.splice(listingIndex, 1)[0];
  writeDb(db);
  return deletedListing;
};
