const { Router } = require("express");
const UploadController = require("../controllers/Upload.controller");
const verifyAccessToken = require("../middleware/verifyAccessToken");

const router = Router();

// Загрузка изображения (требует авторизации)
router.post(
  "/image",
  verifyAccessToken,
  UploadController.uploadSingle,
  UploadController.uploadImage
);

// Удаление изображения (требует авторизации)
router.delete(
  "/image/:filename",
  verifyAccessToken,
  UploadController.deleteImage
);

module.exports = router;
