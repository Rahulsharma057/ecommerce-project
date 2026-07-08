const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /mp4|mov|avi|webm|mkv/;

  const ext = allowed.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mime = file.mimetype.startsWith("video/");

  if (ext && mime) {
    return cb(null, true);
  }

  cb(new Error("Only video files allowed."));
};

module.exports = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});