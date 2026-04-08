const router = require("express").Router();

router.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "The Cliff News API",
    date: new Date().toISOString()
  });
});

module.exports = router;
