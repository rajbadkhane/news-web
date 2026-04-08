const router = require("express").Router();
const store = require("../lib/store");

router.get("/", (_req, res) => {
  const db = store.readDb();
  const recentArticles = [...db.articles]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5)
    .map((article) => ({
      id: article.id,
      titleEn: article.titleEn,
      titleHi: article.titleHi,
      authorName: article.authorName,
      status: article.status,
      updatedAt: article.updatedAt
    }));

  res.json({
    ok: true,
    stats: {
      totalNews: db.articles.length,
      epapers: db.epapers.length,
      highlights: db.highlights.length,
      nits: db.nits.length,
      categories: db.categories.length,
      inshorts: db.inshorts.length,
      notifications: db.notifications.length
    },
    recentArticles
  });
});

module.exports = router;
