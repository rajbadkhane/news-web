const router = require("express").Router();
const store = require("../lib/store");
const { notFound, sendList } = require("../lib/http");
const {
  requireFields,
  ensureCategory,
  normalizeDate,
  normalizeString
} = require("../lib/validators");

router.get("/", (req, res) => {
  const q = normalizeString(req.query.q, "").toLowerCase();
  const status = normalizeString(req.query.status, "");
  const language = normalizeString(req.query.language, "");
  const categoryId = req.query.categoryId ? Number(req.query.categoryId) : null;

  const data = store
    .list("articles")
    .filter((article) => {
      const matchesQuery =
        !q ||
        [article.titleEn, article.titleHi, article.excerptEn, article.excerptHi]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(q));
      const matchesStatus = !status || article.status === status;
      const matchesLanguage = !language || article.languagePrimary === language;
      const matchesCategory = !categoryId || article.categoryId === categoryId;
      return matchesQuery && matchesStatus && matchesLanguage && matchesCategory;
    })
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  sendList(res, data);
});

router.get("/:id", (req, res, next) => {
  try {
    const article = store.getById("articles", req.params.id);
    if (!article) {
      throw notFound("Article not found");
    }
    res.json({ ok: true, data: article });
  } catch (error) {
    next(error);
  }
});

router.post("/", (req, res, next) => {
  try {
    requireFields(req.body, [
      "slug",
      "titleEn",
      "contentEn",
      "authorName",
      "categoryId"
    ]);

    const article = store.create("articles", {
      slug: normalizeString(req.body.slug),
      titleEn: normalizeString(req.body.titleEn),
      titleHi: normalizeString(req.body.titleHi, ""),
      excerptEn: normalizeString(req.body.excerptEn, ""),
      excerptHi: normalizeString(req.body.excerptHi, ""),
      contentEn: normalizeString(req.body.contentEn),
      contentHi: normalizeString(req.body.contentHi, ""),
      authorName: normalizeString(req.body.authorName),
      heroImage: normalizeString(req.body.heroImage, ""),
      videoUrl: normalizeString(req.body.videoUrl, ""),
      languagePrimary: normalizeString(req.body.languagePrimary, "English"),
      status: normalizeString(req.body.status, "DRAFT"),
      publishedAt: normalizeDate(req.body.publishedAt, true),
      categoryId: ensureCategory(req.body.categoryId)
    });

    res.status(201).json({ ok: true, data: article });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", (req, res, next) => {
  try {
    const current = store.getById("articles", req.params.id);
    if (!current) {
      throw notFound("Article not found");
    }

    const updated = store.update("articles", req.params.id, {
      slug: req.body.slug ? normalizeString(req.body.slug) : current.slug,
      titleEn: req.body.titleEn ? normalizeString(req.body.titleEn) : current.titleEn,
      titleHi:
        req.body.titleHi !== undefined ? normalizeString(req.body.titleHi, "") : current.titleHi,
      excerptEn:
        req.body.excerptEn !== undefined
          ? normalizeString(req.body.excerptEn, "")
          : current.excerptEn,
      excerptHi:
        req.body.excerptHi !== undefined
          ? normalizeString(req.body.excerptHi, "")
          : current.excerptHi,
      contentEn: req.body.contentEn ? normalizeString(req.body.contentEn) : current.contentEn,
      contentHi:
        req.body.contentHi !== undefined
          ? normalizeString(req.body.contentHi, "")
          : current.contentHi,
      authorName:
        req.body.authorName ? normalizeString(req.body.authorName) : current.authorName,
      heroImage:
        req.body.heroImage !== undefined
          ? normalizeString(req.body.heroImage, "")
          : current.heroImage,
      videoUrl:
        req.body.videoUrl !== undefined
          ? normalizeString(req.body.videoUrl, "")
          : current.videoUrl,
      languagePrimary: req.body.languagePrimary
        ? normalizeString(req.body.languagePrimary)
        : current.languagePrimary,
      status: req.body.status ? normalizeString(req.body.status) : current.status,
      publishedAt:
        req.body.publishedAt !== undefined
          ? normalizeDate(req.body.publishedAt, true)
          : current.publishedAt,
      categoryId:
        req.body.categoryId !== undefined
          ? ensureCategory(req.body.categoryId)
          : current.categoryId
    });

    res.json({ ok: true, data: updated });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    const deleted = store.remove("articles", req.params.id);
    if (!deleted) {
      throw notFound("Article not found");
    }
    res.json({ ok: true, message: "Article deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
