const router = require("express").Router();
const store = require("../lib/store");
const { badRequest, notFound, sendList } = require("../lib/http");
const { requireFields, normalizeString } = require("../lib/validators");

router.get("/", (_req, res) => {
  const categories = store.list("categories").sort((a, b) => a.id - b.id);
  sendList(res, categories);
});

router.get("/:id", (req, res, next) => {
  try {
    const category = store.getById("categories", req.params.id);
    if (!category) {
      throw notFound("Category not found");
    }
    res.json({ ok: true, data: category });
  } catch (error) {
    next(error);
  }
});

router.post("/", (req, res, next) => {
  try {
    requireFields(req.body, ["name", "slug"]);
    const slug = normalizeString(req.body.slug);
    const duplicate = store.list("categories").find((item) => item.slug === slug);

    if (duplicate) {
      throw badRequest("Category slug already exists");
    }

    const category = store.create("categories", {
      name: normalizeString(req.body.name),
      slug,
      nameHi: normalizeString(req.body.nameHi, "")
    });

    res.status(201).json({ ok: true, data: category });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", (req, res, next) => {
  try {
    const current = store.getById("categories", req.params.id);
    if (!current) {
      throw notFound("Category not found");
    }

    if (req.body.slug) {
      const slug = normalizeString(req.body.slug);
      const duplicate = store
        .list("categories")
        .find((item) => item.slug === slug && item.id !== current.id);
      if (duplicate) {
        throw badRequest("Category slug already exists");
      }
    }

    const updated = store.update("categories", req.params.id, {
      name: req.body.name ? normalizeString(req.body.name) : current.name,
      slug: req.body.slug ? normalizeString(req.body.slug) : current.slug,
      nameHi:
        req.body.nameHi !== undefined ? normalizeString(req.body.nameHi, "") : current.nameHi
    });

    res.json({ ok: true, data: updated });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", (req, res, next) => {
  try {
    const categoryId = Number(req.params.id);
    const db = store.readDb();
    const hasRelations = [
      ...db.articles,
      ...db.highlights,
      ...db.inshorts
    ].some((item) => item.categoryId === categoryId);

    if (hasRelations) {
      throw badRequest("Category is in use by content and cannot be deleted");
    }

    const deleted = store.remove("categories", categoryId);
    if (!deleted) {
      throw notFound("Category not found");
    }

    res.json({ ok: true, message: "Category deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
