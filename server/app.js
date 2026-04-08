const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health");
const dashboardRoutes = require("./routes/dashboard");
const articleRoutes = require("./routes/articles");
const categoryRoutes = require("./routes/categories");
const epaperRoutes = require("./routes/epapers");
const highlightRoutes = require("./routes/highlights");
const nitRoutes = require("./routes/nit");
const inshortRoutes = require("./routes/inshorts");
const notificationRoutes = require("./routes/notifications");

const app = express();

app.use(cors());
app.use(express.json({ limit: "12mb" }));

app.use("/api", healthRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/epapers", epaperRoutes);
app.use("/api/highlights", highlightRoutes);
app.use("/api/nit", nitRoutes);
app.use("/api/inshorts", inshortRoutes);
app.use("/api/notifications", notificationRoutes);

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    ok: false,
    message: err.message || "Internal server error"
  });
});

module.exports = app;
