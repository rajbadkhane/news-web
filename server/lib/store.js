const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "data", "seed.json");

function ensureDb() {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(
      dbPath,
      JSON.stringify(
        {
          categories: [],
          articles: [],
          epapers: [],
          highlights: [],
          nits: [],
          inshorts: [],
          notifications: []
        },
        null,
        2
      )
    );
  }
}

function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function list(collection) {
  const db = readDb();
  return db[collection] || [];
}

function getById(collection, id) {
  return list(collection).find((item) => item.id === Number(id)) || null;
}

function create(collection, payload) {
  const db = readDb();
  const items = db[collection] || [];
  const nextId = items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
  const timestamp = new Date().toISOString();
  const record = {
    id: nextId,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...payload
  };
  db[collection] = [record, ...items];
  writeDb(db);
  return record;
}

function update(collection, id, payload) {
  const db = readDb();
  const items = db[collection] || [];
  const targetId = Number(id);
  const index = items.findIndex((item) => item.id === targetId);

  if (index === -1) {
    return null;
  }

  const updated = {
    ...items[index],
    ...payload,
    id: targetId,
    updatedAt: new Date().toISOString()
  };

  items[index] = updated;
  db[collection] = items;
  writeDb(db);
  return updated;
}

function remove(collection, id) {
  const db = readDb();
  const items = db[collection] || [];
  const targetId = Number(id);
  const index = items.findIndex((item) => item.id === targetId);

  if (index === -1) {
    return false;
  }

  items.splice(index, 1);
  db[collection] = items;
  writeDb(db);
  return true;
}

module.exports = {
  readDb,
  list,
  getById,
  create,
  update,
  remove
};
