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
    .list("epapers")
    .sort((a, b) => new Date(b.editionDate) - new Date(a.editionDate));
  sendList(res, data);
});

router.get("/:id", (req, res, next) => {
  try {
    const epaper = store.getById("epapers", req.params.id);
    if (!epaper) {
      throw notFound("E-paper not found");
    }
    res.json({ ok: true, data: epaper });
  } catch (error) {
    next(error);
  }
});

router.post("/", (req, res, next) => {
  try {
    requireFields(req.body, ["title", "editionDate", "pdfUrl", "thumbnailUrl"]);
    const epaper = store.create("epapers", {
      title: normalizeString(req.body.title),
      editionDate: normalizeDate(req.body.editionDate, false),
      language: normalizeString(req.body.language, "English"),
      pdfUrl: normalizeString(req.body.pdfUrl),
      thumbnailUrl: normalizeString(req.body.thumbnailUrl),
      isPublished: normalizeBoolean(req.body.isPublished)
    });
    res.status(201).json({ ok: true, data: epaper });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", (req, res, next) => {
  try {
    const current = store.getById("epapers", req.params.id);
    if (!current) {
      throw notFound("E-paper not found");
    }

    const updated = store.update("epapers", req.params.id, {
      title: req.body.title ? normalizeString(req.body.title) : current.title,
      editionDate:
        req.body.editionDate !== undefined
          ? normalizeDate(req.body.editionDate, false)
          : current.editionDate,
      language: req.body.language ? normalizeString(req.body.language) : current.language,
      pdfUrl: req.body.pdfUrl ? normalizeString(req.body.pdfUrl) : current.pdfUrl,
      thumbnailUrl: req.body.thumbnailUrl
        ? normalizeString(req.body.thumbnailUrl)
        : current.thumbnailUrl,
      isPublished:
        req.body.isPublished !== undefined
          ? normalizeBoolean(req.body.isPublished)
          : current.isPublished
    });

    res.json({ ok: true, data: updated });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    const deleted = store.remove("epapers", req.params.id);
    if (!deleted) {
      throw notFound("E-paper not found");
    }
    res.json({ ok: true, message: "E-paper deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
