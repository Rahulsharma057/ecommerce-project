const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "image") {
    const allowedTypes = /jpg|jpeg|png|webp/;

    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    const mimetype = file.mimetype.startsWith("image/");

    if (extname && mimetype) {
      return cb(null, true);
    }

    return cb(
      new Error("Only JPG, JPEG, PNG and WEBP images are allowed.")
    );
  }

  if (file.fieldname === "video") {
    const allowedTypes = /mp4|mov|avi|webm|mkv/;

    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    const mimetype = file.mimetype.startsWith("video/");

    if (extname && mimetype) {
      return cb(null, true);
    }

    return cb(
      new Error("Only MP4, MOV, AVI, WEBM and MKV videos are allowed.")
    );
  }

  cb(new Error("Invalid file field."));
};

const uploadMedia = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

module.exports = uploadMedia;