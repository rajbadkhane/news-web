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
    .list("inshorts")
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  sendList(res, data);
});

router.get("/:id", (req, res, next) => {
  try {
    const record = store.getById("inshorts", req.params.id);
    if (!record) {
      throw notFound("Inshort not found");
    }
    res.json({ ok: true, data: record });
  } catch (error) {
    next(error);
  }
});

router.post("/", (req, res, next) => {
  try {
    requireFields(req.body, ["headlineEn", "bodyEn"]);
    const record = store.create("inshorts", {
      headlineEn: normalizeString(req.body.headlineEn),
      headlineHi: normalizeString(req.body.headlineHi, ""),
      bodyEn: normalizeString(req.body.bodyEn),
      bodyHi: normalizeString(req.body.bodyHi, ""),
      isPublished: normalizeBoolean(req.body.isPublished),
      categoryId: ensureCategory(req.body.categoryId, true)
    });
    res.status(201).json({ ok: true, data: record });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", (req, res, next) => {
  try {
    const current = store.getById("inshorts", req.params.id);
    if (!current) {
      throw notFound("Inshort not found");
    }

    const updated = store.update("inshorts", req.params.id, {
      headlineEn: req.body.headlineEn
        ? normalizeString(req.body.headlineEn)
        : current.headlineEn,
      headlineHi:
        req.body.headlineHi !== undefined
          ? normalizeString(req.body.headlineHi, "")
          : current.headlineHi,
      bodyEn: req.body.bodyEn ? normalizeString(req.body.bodyEn) : current.bodyEn,
      bodyHi:
        req.body.bodyHi !== undefined ? normalizeString(req.body.bodyHi, "") : current.bodyHi,
      isPublished:
        req.body.isPublished !== undefined
          ? normalizeBoolean(req.body.isPublished)
          : current.isPublished,
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
    const deleted = store.remove("inshorts", req.params.id);
    if (!deleted) {
      throw notFound("Inshort not found");
    }
    res.json({ ok: true, message: "Inshort deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
