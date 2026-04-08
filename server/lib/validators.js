const { badRequest } = require("./http");
const store = require("./store");

function requireFields(payload, fields) {
  for (const field of fields) {
    if (
      payload[field] === undefined ||
      payload[field] === null ||
      payload[field] === ""
    ) {
      throw badRequest(`${field} is required`);
    }
  }
}

function ensureCategory(categoryId, allowEmpty = false) {
  if ((categoryId === undefined || categoryId === null || categoryId === "") && allowEmpty) {
    return null;
  }

  const normalized = Number(categoryId);
  if (!Number.isInteger(normalized)) {
    throw badRequest("categoryId must be a valid number");
  }

  const category = store.getById("categories", normalized);
  if (!category) {
    throw badRequest(`Category ${normalized} does not exist`);
  }

  return normalized;
}

function normalizeBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  if (value === undefined) return fallback;
  return Boolean(value);
}

function normalizeString(value, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function normalizeDate(value, allowEmpty = true) {
  if ((value === undefined || value === null || value === "") && allowEmpty) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw badRequest("Invalid date provided");
  }

  return parsed.toISOString();
}

module.exports = {
  requireFields,
  ensureCategory,
  normalizeBoolean,
  normalizeDate,
  normalizeString
};
