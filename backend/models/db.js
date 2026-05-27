import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', '..', 'data', 'db.json');

/**
 * Normaliza el JSON con colecciones base.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Record<string, any>} data
 * @returns {Record<string, any>}
 */
const ensureDb = (data) => {
  const safeData = {};
  safeData.users = Array.isArray(data?.users) ? data.users : [];
  safeData.orgs = Array.isArray(data?.orgs) ? data.orgs : [];
  safeData.events = Array.isArray(data?.events) ? data.events : [];
  safeData.eventParticipants = Array.isArray(data?.eventParticipants) ? data.eventParticipants : [];
  safeData.orgJoinRequests = Array.isArray(data?.orgJoinRequests) ? data.orgJoinRequests : [];
  safeData.resourceListings = Array.isArray(data?.resourceListings) ? data.resourceListings : [];
  return safeData;
};

/**
 * Lee la base de datos JSON.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @returns {Record<string, any>}
 */
export const readDb = () => {
  const raw = fs.readFileSync(dbPath, 'utf8');
  const data = JSON.parse(raw);
  return ensureDb(data);
};

/**
 * Guarda la base de datos JSON con formato.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Record<string, any>} data
 * @returns {void}
 */
export const writeDb = (data) => {
  const pretty = JSON.stringify(data, null, 2);
  fs.writeFileSync(dbPath, pretty, 'utf8');
};

/**
 * Calcula un id incremental sencillo.
 *
 * @author KiliaCuadrado
 * @date 2026-05-27
 * @param {Array<{ id: string | number }>} items
 * @returns {number}
 */
export const nextId = (items) => {
  let maxId = 0;
  for (let i = 0; i < items.length; i += 1) {
    const currentId = Number(items[i].id);
    if (!Number.isNaN(currentId) && currentId > maxId) {
      maxId = currentId;
    }
  }
  return maxId + 1;
};
