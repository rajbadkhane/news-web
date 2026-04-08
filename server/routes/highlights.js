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
  const q = normalizeString(_req.query.q, "").toLowerCase();
  const categoryId = _req.query.categoryId ? Number(_req.query.categoryId) : null;
  const priority = normalizeString(_req.query.priority, "");
  const sortBy = normalizeString(_req.query.sortBy, "latest");
  const data = store
    .list("highlights")
    .filter((item) => {
      const matchesQuery =
        !q ||
        [
          item.titleEn,
          item.titleHi,
          item.summaryEn,
          item.summaryHi,
          item.caption,
          item.tags
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q));
      const matchesCategory = !categoryId || item.categoryId === categoryId;
      const matchesPriority = !priority || item.priority === priority;
      return matchesQuery && matchesCategory && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === "priority") {
        return (b.priorityWeight || 0) - (a.priorityWeight || 0);
      }
      if (sortBy === "views") {
        return (b.views || 0) - (a.views || 0);
      }
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  sendList(res, data);
});

router.post("/", (req, res, next) => {
  try {
    requireFields(req.body, ["titleEn"]);
    const record = store.create("highlights", {
      titleEn: normalizeString(req.body.titleEn),
      titleHi: normalizeString(req.body.titleHi, ""),
      summaryEn: normalizeString(req.body.summaryEn, ""),
      summaryHi: normalizeString(req.body.summaryHi, ""),
      imageUrl: normalizeString(req.body.imageUrl, ""),
      caption: normalizeString(req.body.caption, ""),
      priority: normalizeString(req.body.priority, "NORMAL"),
      priorityWeight: Number(req.body.priorityWeight || 1),
      location: normalizeString(req.body.location, ""),
      tags: normalizeString(req.body.tags, ""),
      source: normalizeString(req.body.source, ""),
      altText: normalizeString(req.body.altText, ""),
      views: Number(req.body.views || 0),
      downloads: Number(req.body.downloads || 0),
      shares: Number(req.body.shares || 0),
      showInGallery: normalizeBoolean(req.body.showInGallery, true),
      allowDownloads: normalizeBoolean(req.body.allowDownloads, true),
      allowSharing: normalizeBoolean(req.body.allowSharing, true),
      addWatermark: normalizeBoolean(req.body.addWatermark, true),
      displayOrder: Number(req.body.displayOrder || 0),
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
    const current = store.getById("highlights", req.params.id);
    if (!current) {
      throw notFound("Highlight not found");
    }
    const updated = store.update("highlights", req.params.id, {
      titleEn: req.body.titleEn ? normalizeString(req.body.titleEn) : current.titleEn,
      titleHi:
        req.body.titleHi !== undefined ? normalizeString(req.body.titleHi, "") : current.titleHi,
      summaryEn:
        req.body.summaryEn !== undefined
          ? normalizeString(req.body.summaryEn, "")
          : current.summaryEn,
      summaryHi:
        req.body.summaryHi !== undefined
          ? normalizeString(req.body.summaryHi, "")
          : current.summaryHi,
      imageUrl:
        req.body.imageUrl !== undefined
          ? normalizeString(req.body.imageUrl, "")
          : current.imageUrl,
      caption:
        req.body.caption !== undefined ? normalizeString(req.body.caption, "") : current.caption,
      priority:
        req.body.priority !== undefined
          ? normalizeString(req.body.priority, "NORMAL")
          : current.priority,
      priorityWeight:
        req.body.priorityWeight !== undefined
          ? Number(req.body.priorityWeight)
          : current.priorityWeight,
      location:
        req.body.location !== undefined ? normalizeString(req.body.location, "") : current.location,
      tags: req.body.tags !== undefined ? normalizeString(req.body.tags, "") : current.tags,
      source:
        req.body.source !== undefined ? normalizeString(req.body.source, "") : current.source,
      altText:
        req.body.altText !== undefined ? normalizeString(req.body.altText, "") : current.altText,
      views: req.body.views !== undefined ? Number(req.body.views) : current.views,
      downloads:
        req.body.downloads !== undefined ? Number(req.body.downloads) : current.downloads,
      shares: req.body.shares !== undefined ? Number(req.body.shares) : current.shares,
      showInGallery:
        req.body.showInGallery !== undefined
          ? normalizeBoolean(req.body.showInGallery)
          : current.showInGallery,
      allowDownloads:
        req.body.allowDownloads !== undefined
          ? normalizeBoolean(req.body.allowDownloads)
          : current.allowDownloads,
      allowSharing:
        req.body.allowSharing !== undefined
          ? normalizeBoolean(req.body.allowSharing)
          : current.allowSharing,
      addWatermark:
        req.body.addWatermark !== undefined
          ? normalizeBoolean(req.body.addWatermark)
          : current.addWatermark,
      displayOrder:
        req.body.displayOrder !== undefined
          ? Number(req.body.displayOrder)
          : current.displayOrder,
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
    const deleted = store.remove("highlights", req.params.id);
    if (!deleted) {
      throw notFound("Highlight not found");
    }
    res.json({ ok: true, message: "Highlight deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
