import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbDir = path.join(__dirname, '..', '..', 'data');
const sqlitePath = path.join(dbDir, 'database.sqlite');

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Open sqlite database (synchronous, simple for this project)
const db = new Database(sqlitePath);

// Initialize schema if needed
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT,
  orgId INTEGER
);

CREATE TABLE IF NOT EXISTS orgs (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  url TEXT,
  contactEmail TEXT,
  ownerUserId INTEGER,
  status TEXT
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY,
  title TEXT,
  description TEXT,
  date TEXT,
  orgId INTEGER
);

CREATE TABLE IF NOT EXISTS eventParticipants (
  id INTEGER PRIMARY KEY,
  eventId INTEGER,
  userId INTEGER,
  createdAt TEXT
);

CREATE TABLE IF NOT EXISTS orgJoinRequests (
  id INTEGER PRIMARY KEY,
  orgId INTEGER,
  userId INTEGER,
  status TEXT,
  createdAt TEXT
);

CREATE TABLE IF NOT EXISTS resourceListings (
  id INTEGER PRIMARY KEY,
  type TEXT,
  title TEXT,
  description TEXT,
  category TEXT,
  quantity INTEGER,
  unit TEXT,
  location TEXT,
  condition TEXT,
  ownerUserId INTEGER,
  orgId INTEGER,
  status TEXT,
  createdAt TEXT
);
`);

/**
 * Lee la base de datos y devuelve el objeto con arrays (compatibilidad con el código existente).
 */
export const readDb = () => {
  return {
    users: db.prepare('SELECT * FROM users').all(),
    orgs: db.prepare('SELECT * FROM orgs').all(),
    events: db.prepare('SELECT * FROM events').all(),
    eventParticipants: db.prepare('SELECT * FROM eventParticipants').all(),
    orgJoinRequests: db.prepare('SELECT * FROM orgJoinRequests').all(),
    resourceListings: db.prepare('SELECT * FROM resourceListings').all(),
  };
};

/**
 * Guarda el objeto completo en la base de datos (elimina y re-inserta las colecciones).
 * Implementación simple: limpia tablas y vuelve a insertar según los arrays proporcionados.
 */
export const writeDb = (data) => {
  const insertUsers = db.prepare(`INSERT INTO users (id, username, email, password, role, orgId) VALUES (@id, @username, @email, @password, @role, @orgId)`);
  const insertOrgs = db.prepare(`INSERT INTO orgs (id, name, description, image, url, contactEmail, ownerUserId, status) VALUES (@id, @name, @description, @image, @url, @contactEmail, @ownerUserId, @status)`);
  const insertEvents = db.prepare(`INSERT INTO events (id, title, description, date, orgId) VALUES (@id, @title, @description, @date, @orgId)`);
  const insertEventParticipants = db.prepare(`INSERT INTO eventParticipants (id, eventId, userId, createdAt) VALUES (@id, @eventId, @userId, @createdAt)`);
  const insertOrgJoinRequests = db.prepare(`INSERT INTO orgJoinRequests (id, orgId, userId, status, createdAt) VALUES (@id, @orgId, @userId, @status, @createdAt)`);
  const insertResourceListings = db.prepare(`INSERT INTO resourceListings (id, type, title, description, category, quantity, unit, location, condition, ownerUserId, orgId, status, createdAt) VALUES (@id, @type, @title, @description, @category, @quantity, @unit, @location, @condition, @ownerUserId, @orgId, @status, @createdAt)`);

  const transaction = db.transaction((payload) => {
    // Clear tables
    db.prepare('DELETE FROM users').run();
    db.prepare('DELETE FROM orgs').run();
    db.prepare('DELETE FROM events').run();
    db.prepare('DELETE FROM eventParticipants').run();
    db.prepare('DELETE FROM orgJoinRequests').run();
    db.prepare('DELETE FROM resourceListings').run();

    // Insert
    (payload.users || []).forEach((u) => insertUsers.run(u));
    (payload.orgs || []).forEach((o) => insertOrgs.run(o));
    (payload.events || []).forEach((e) => insertEvents.run(e));
    (payload.eventParticipants || []).forEach((p) => insertEventParticipants.run(p));
    (payload.orgJoinRequests || []).forEach((r) => insertOrgJoinRequests.run(r));
    (payload.resourceListings || []).forEach((rl) => insertResourceListings.run(rl));
  });

  transaction(data);
};

/**
 * Calcula un id incremental sencillo para compatibilidad.
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
