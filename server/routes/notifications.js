const router = require("express").Router();
const store = require("../lib/store");
const { notFound, sendList } = require("../lib/http");
const {
  requireFields,
  normalizeBoolean,
  normalizeDate,
  normalizeString
} = require("../lib/validators");

router.get("/", (_req, res) => {
  const data = store
    .list("notifications")
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  sendList(res, data);
});

router.get("/:id", (req, res, next) => {
  try {
    const record = store.getById("notifications", req.params.id);
    if (!record) {
      throw notFound("Notification not found");
    }
    res.json({ ok: true, data: record });
  } catch (error) {
    next(error);
  }
});

router.post("/", (req, res, next) => {
  try {
    requireFields(req.body, ["title", "body"]);
    const record = store.create("notifications", {
      title: normalizeString(req.body.title),
      body: normalizeString(req.body.body),
      audience: normalizeString(req.body.audience, ""),
      type: normalizeString(req.body.type, "EDITORIAL"),
      sentAt: normalizeDate(req.body.sentAt, true),
      isScheduled: normalizeBoolean(req.body.isScheduled),
      scheduledFor: normalizeDate(req.body.scheduledFor, true)
    });
    res.status(201).json({ ok: true, data: record });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", (req, res, next) => {
  try {
    const current = store.getById("notifications", req.params.id);
    if (!current) {
      throw notFound("Notification not found");
    }
    const updated = store.update("notifications", req.params.id, {
      title: req.body.title ? normalizeString(req.body.title) : current.title,
      body: req.body.body ? normalizeString(req.body.body) : current.body,
      audience:
        req.body.audience !== undefined
          ? normalizeString(req.body.audience, "")
          : current.audience,
      type: req.body.type ? normalizeString(req.body.type) : current.type,
      sentAt:
        req.body.sentAt !== undefined
          ? normalizeDate(req.body.sentAt, true)
          : current.sentAt,
      isScheduled:
        req.body.isScheduled !== undefined
          ? normalizeBoolean(req.body.isScheduled)
          : current.isScheduled,
      scheduledFor:
        req.body.scheduledFor !== undefined
          ? normalizeDate(req.body.scheduledFor, true)
          : current.scheduledFor
    });
    res.json({ ok: true, data: updated });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    const deleted = store.remove("notifications", req.params.id);
    if (!deleted) {
      throw notFound("Notification not found");
    }
    res.json({ ok: true, message: "Notification deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
