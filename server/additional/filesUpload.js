const multer = require("multer");

const fileStorageEngineAvatar = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './avatars');
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const fileStorageEnginePost = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './picture-post');
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const uploadAvatar = multer({ storage: fileStorageEngineAvatar });
const uploadPost = multer({ storage: fileStorageEnginePost });

module.exports = { uploadAvatar, uploadPost };