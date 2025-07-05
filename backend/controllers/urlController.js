const logEvent = require("../middlewares/logger");

exports.createShortUrl = async (req, res) => {
  const { url, shortcode, expiry } = req.body;

  try {
    // mock create logic
    const shortUrl = `https://short.ly/${shortcode || "abc123"}`;
    await logEvent("backend", "info", "controller", "Short URL created");

    res.json({ shortUrl, expiry });
  } catch (error) {
    await logEvent("backend", "error", "controller", "Failed to create short URL");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getStats = async (req, res) => {
  try {
    await logEvent("backend", "info", "controller", "Stats fetched");
    res.json({ clicks: 42, shortcode: req.params.shortcode });
  } catch (error) {
    await logEvent("backend", "error", "controller", "Failed to get stats");
    res.status(500).json({ message: "Internal Server Error" });
  }
};
