const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/aws');
const path = require('path');

// Конфигурация загрузки файлов в S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      cb(null, `uploads/${file.fieldname}-${uniqueSuffix}${extension}`);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB лимит
  },
  fileFilter: function (req, file, cb) {
    // Проверка типа файла
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Разрешены только изображения'), false);
    }
  }
});

// Middleware для загрузки одного файла
const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ 
          message: `Ошибка загрузки файла: ${err.message}` 
        });
      } else if (err) {
        return res.status(400).json({ 
          message: err.message 
        });
      }
      next();
    });
  };
};

// Middleware для загрузки нескольких файлов
const uploadMultiple = (fieldName, maxCount = 10) => {
  return (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ 
          message: `Ошибка загрузки файлов: ${err.message}` 
        });
      } else if (err) {
        return res.status(400).json({ 
          message: err.message 
        });
      }
      next();
    });
  };
};

module.exports = {
  uploadSingle,
  uploadMultiple
};