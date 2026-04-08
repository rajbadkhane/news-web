const router = require("express").Router();
const store = require("../lib/store");
const { notFound, sendList } = require("../lib/http");
const {
  requireFields,
  ensureCategory,
  normalizeBoolean,
  normalizeString
} = require("../lib/validators");

router.get("/", (_req, res) => {
  const data = store
    .list("nits")
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  sendList(res, data);
});

router.get("/:id", (req, res, next) => {
  try {
    const record = store.getById("nits", req.params.id);
    if (!record) {
      throw notFound("NIT item not found");
    }
    res.json({ ok: true, data: record });
  } catch (error) {
    next(error);
  }
});

router.post("/", (req, res, next) => {
  try {
    requireFields(req.body, ["title", "summary"]);
    const record = store.create("nits", {
      title: normalizeString(req.body.title),
      titleHi: normalizeString(req.body.titleHi, ""),
      summary: normalizeString(req.body.summary),
      summaryHi: normalizeString(req.body.summaryHi, ""),
      region: normalizeString(req.body.region, ""),
      tag: normalizeString(req.body.tag, ""),
      sentiment: normalizeString(req.body.sentiment, "NEUTRAL"),
      priority: normalizeString(req.body.priority, "MEDIUM"),
      source: normalizeString(req.body.source, ""),
      isActive: normalizeBoolean(req.body.isActive, true),
      categoryId: ensureCategory(req.body.categoryId, true)
    });
    res.status(201).json({ ok: true, data: record });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", (req, res, next) => {
  try {
    const current = store.getById("nits", req.params.id);
    if (!current) {
      throw notFound("NIT item not found");
    }

    const updated = store.update("nits", req.params.id, {
      title: req.body.title ? normalizeString(req.body.title) : current.title,
      titleHi:
        req.body.titleHi !== undefined ? normalizeString(req.body.titleHi, "") : current.titleHi,
      summary: req.body.summary ? normalizeString(req.body.summary) : current.summary,
      summaryHi:
        req.body.summaryHi !== undefined
          ? normalizeString(req.body.summaryHi, "")
          : current.summaryHi,
      region: req.body.region !== undefined ? normalizeString(req.body.region, "") : current.region,
      tag: req.body.tag !== undefined ? normalizeString(req.body.tag, "") : current.tag,
      sentiment: req.body.sentiment
        ? normalizeString(req.body.sentiment)
        : current.sentiment,
      priority: req.body.priority ? normalizeString(req.body.priority) : current.priority,
      source: req.body.source !== undefined ? normalizeString(req.body.source, "") : current.source,
      isActive:
        req.body.isActive !== undefined
          ? normalizeBoolean(req.body.isActive)
          : current.isActive,
      categoryId:
        req.body.categoryId !== undefined
          ? ensureCategory(req.body.categoryId, true)
          : current.categoryId
    });

    res.json({ ok: true, data: updated });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    const deleted = store.remove("nits", req.params.id);
    if (!deleted) {
      throw notFound("NIT item not found");
    }
    res.json({ ok: true, message: "NIT item deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
