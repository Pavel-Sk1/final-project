const multer = require("multer");
const path = require("path");
const fs = require("fs");
const formatResponse = require("../utils/formatResponse");

// Создаем папки для загрузки, если их нет
const uploadDir = path.join(__dirname, "..", "uploads");
const imagesDir = path.join(uploadDir, "images");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Конфигурация multer для сохранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    // Генерируем уникальное имя файла
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `image-${uniqueSuffix}${ext}`);
  },
});

// Фильтр для проверки типа файла
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Разрешены только изображения (JPEG, JPG, PNG, GIF, WebP)"));
  }
};

// Настройки multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB максимальный размер
  },
  fileFilter: fileFilter,
});

class UploadController {
  // Загрузка одного изображения
  static uploadSingle = upload.single("image");

  static async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json(formatResponse(400, "Файл не был загружен"));
      }

      // Генерируем URL для доступа к файлу
      const fileUrl = `/uploads/images/${req.file.filename}`;

      const responseData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: fileUrl,
        uploadedAt: new Date().toISOString(),
      };

      res
        .status(200)
        .json(
          formatResponse(200, "Изображение успешно загружено", responseData)
        );
    } catch (error) {
      console.error("Upload error:", error);
      res
        .status(500)
        .json(
          formatResponse(500, "Ошибка при загрузке файла", null, error.message)
        );
    }
  }

  // Удаление изображения
  static async deleteImage(req, res) {
    try {
      const { filename } = req.params;

      if (!filename) {
        return res
          .status(400)
          .json(formatResponse(400, "Не указано имя файла"));
      }

      const filePath = path.join(imagesDir, filename);

      // Проверяем существование файла
      if (!fs.existsSync(filePath)) {
        return res.status(404).json(formatResponse(404, "Файл не найден"));
      }

      // Удаляем файл
      fs.unlinkSync(filePath);

      res
        .status(200)
        .json(formatResponse(200, "Изображение успешно удалено", { filename }));
    } catch (error) {
      console.error("Delete error:", error);
      res
        .status(500)
        .json(
          formatResponse(500, "Ошибка при удалении файла", null, error.message)
        );
    }
  }
}

module.exports = UploadController;
