const express = require("express");
const router = express.Router();
const {
  createNews,
  getAllNews,
  getNewsByCategory,
  getNewsById,

  // ADMIN
  getAdminNews,
  updateNews,
  updateNewsFlags,
  publishNews,
  unpublishNews,
  deleteNews,
  getAdminNewsById,
  searchNews,
} = require("../controllers/news.controller");
const upload = require("../middleware/upload");

router.post("/",upload.single("thumbnail"), createNews);
router.get("/", getAllNews);
router.get("/category/:category", getNewsByCategory);
router.get("/admin", getAdminNews);
router.get("/admin/:id", getAdminNewsById);
router.patch("/admin/:id",upload.single("thumbnail"), updateNews);
router.patch("/admin/:id/flags", updateNewsFlags);
router.patch("/admin/:id/publish", publishNews);
router.patch("/admin/:id/unpublish", unpublishNews);
router.delete("/admin/:id", deleteNews);
router.get("/search", searchNews);
router.get("/:id", getNewsById);


module.exports = router;