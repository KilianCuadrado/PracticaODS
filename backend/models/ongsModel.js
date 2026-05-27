import { nextId, readDb, writeDb } from './db.js';

/**
 * Lista organizaciones con filtro opcional por estado.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string} status
 * @returns {Array<Record<string, any>>}
 */
export const listOngs = (status) => {
  const db = readDb();
  if (!status) {
    return db.orgs;
  }
  const filtered = [];
  for (let i = 0; i < db.orgs.length; i += 1) {
    if (String(db.orgs[i].status || 'approved') === String(status)) {
      filtered.push(db.orgs[i]);
    }
  }
  return filtered;
};

/**
 * Busca una ORG por id.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} orgId
 * @returns {Record<string, any> | null}
 */
export const findOngById = (ongId) => {
  const db = readDb();
  for (let i = 0; i < db.orgs.length; i += 1) {
    if (Number(db.orgs[i].id) === Number(ongId)) {
      return db.orgs[i];
    }
  }
  return null;
};

/**
 * Busca una ORG por nombre.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string} name
 * @returns {Record<string, any> | null}
 */
export const findOngByName = (name) => {
  const db = readDb();
  for (let i = 0; i < db.orgs.length; i += 1) {
    if (String(db.orgs[i].name || '').toLowerCase() === String(name).toLowerCase()) {
      return db.orgs[i];
    }
  }
  return null;
};

/**
 * Busca una ORG por ownerUserId.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} ownerUserId
 * @returns {Record<string, any> | null}
 */
export const findOngByOwnerId = (ownerUserId) => {
  const db = readDb();
  for (let i = 0; i < db.orgs.length; i += 1) {
    if (Number(db.orgs[i].ownerUserId) === Number(ownerUserId)) {
      return db.orgs[i];
    }
  }
  return null;
};

/**
 * Crea una ORG.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Record<string, any>} payload
 * @returns {Record<string, any>}
 */
export const createOng = (payload) => {
  const db = readDb();
  const newOrg = {
    id: nextId(db.orgs),
    name: String(payload.name).trim(),
    description: String(payload.description).trim(),
    image: payload.image || '',
    url: payload.url || '',
    contactEmail: payload.contactEmail || '',
    ownerUserId: payload.ownerUserId || null,
    status: payload.status || 'approved',
  };
  db.orgs.push(newOrg);
  writeDb(db);
  return newOrg;
};

/**
 * Actualiza una ORG.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} orgId
 * @param {Record<string, any>} payload
 * @returns {Record<string, any> | null}
 */
export const updateOng = (ongId, payload) => {
  const db = readDb();
  let orgIndex = -1;
  for (let i = 0; i < db.orgs.length; i += 1) {
    if (Number(db.orgs[i].id) === Number(ongId)) {
      orgIndex = i;
      break;
    }
  }
  if (orgIndex === -1) {
    return null;
  }

  const currentOrg = db.orgs[orgIndex];
  const updatedOrg = {
    id: currentOrg.id,
    name: payload.name !== undefined ? String(payload.name).trim() : currentOrg.name,
    description:
      payload.description !== undefined
        ? String(payload.description).trim()
        : currentOrg.description,
    image: payload.image !== undefined ? payload.image : currentOrg.image,
    url: payload.url !== undefined ? payload.url : currentOrg.url,
    contactEmail: payload.contactEmail !== undefined ? payload.contactEmail : currentOrg.contactEmail,
    ownerUserId: currentOrg.ownerUserId,
    status: currentOrg.status,
  };

  db.orgs[orgIndex] = updatedOrg;
  writeDb(db);
  return updatedOrg;
};

/**
 * Elimina una ORG y limpia relaciones.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} orgId
 * @returns {Record<string, any> | null}
 */
export const deleteOng = (ongId) => {
  const db = readDb();
  let orgIndex = -1;
  for (let i = 0; i < db.orgs.length; i += 1) {
    if (Number(db.orgs[i].id) === Number(ongId)) {
      orgIndex = i;
      break;
    }
  }
  if (orgIndex === -1) {
    return null;
  }

  const deletedOrg = db.orgs.splice(orgIndex, 1)[0];

  const remainingEvents = [];
  for (let i = 0; i < db.events.length; i += 1) {
    if (Number(db.events[i].orgId) !== Number(ongId)) {
      remainingEvents.push(db.events[i]);
    }
  }
  db.events = remainingEvents;

  const remainingRequests = [];
  for (let i = 0; i < db.orgJoinRequests.length; i += 1) {
    if (Number(db.orgJoinRequests[i].orgId) !== Number(ongId)) {
      remainingRequests.push(db.orgJoinRequests[i]);
    }
  }
  db.orgJoinRequests = remainingRequests;

  writeDb(db);
  return deletedOrg;
};

/**
 * Actualiza el estado de una ORG.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} orgId
 * @param {string} status
 * @returns {Record<string, any> | null}
 */
export const updateOngStatus = (ongId, status) => {
  const db = readDb();
  let orgIndex = -1;
  for (let i = 0; i < db.orgs.length; i += 1) {
    if (Number(db.orgs[i].id) === Number(ongId)) {
      orgIndex = i;
      break;
    }
  }
  if (orgIndex === -1) {
    return null;
  }
  db.orgs[orgIndex].status = status;
  writeDb(db);
  return db.orgs[orgIndex];
};

/**
 * Crea una solicitud de union a ORG.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} orgId
 * @param {string | number} userId
 * @returns {Record<string, any>}
 */
export const createOngJoinRequest = (ongId, userId) => {
  const db = readDb();
  const newRequest = {
    id: nextId(db.orgJoinRequests),
    orgId: ongId,
    userId,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  db.orgJoinRequests.push(newRequest);
  writeDb(db);
  return newRequest;
};

/**
 * Lista solicitudes de una ORG.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} orgId
 * @returns {Array<Record<string, any>>}
 */
export const listOngRequests = (ongId) => {
  const db = readDb();
  const requests = [];
  for (let i = 0; i < db.orgJoinRequests.length; i += 1) {
    if (Number(db.orgJoinRequests[i].orgId) === Number(ongId)) {
      requests.push(db.orgJoinRequests[i]);
    }
  }
  return requests;
};

/**
 * Resuelve una solicitud con approved o rejected.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {string | number} orgId
 * @param {string | number} requestId
 * @param {string} status
 * @returns {Record<string, any> | null}
 */
export const resolveOngRequest = (ongId, requestId, status) => {
  const db = readDb();
  let requestIndex = -1;
  for (let i = 0; i < db.orgJoinRequests.length; i += 1) {
    const requestItem = db.orgJoinRequests[i];
    if (Number(requestItem.id) === Number(requestId) && Number(requestItem.orgId) === Number(ongId)) {
      requestIndex = i;
      break;
    }
  }
  if (requestIndex === -1) {
    return null;
  }

  db.orgJoinRequests[requestIndex].status = status;
  if (status === 'approved') {
    const requestData = db.orgJoinRequests[requestIndex];
    for (let i = 0; i < db.users.length; i += 1) {
      if (Number(db.users[i].id) === Number(requestData.userId)) {
        db.users[i].orgId = ongId;
        break;
      }
    }
  }

  writeDb(db);
  return db.orgJoinRequests[requestIndex];
};
