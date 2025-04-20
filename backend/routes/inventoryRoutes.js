// inventoryRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
  getPicture
} = require('../controllers/inventoryController');

const storage = new GridFsStorage({
  db: mongoose.connection, // Use existing mongoose connection
  file: (req, file) => {
    return {
      bucketName: 'uploads',
      filename: `${Date.now()}-${file.originalname}`
    };
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(file.originalname.toLowerCase().split('.').pop());
    const mimetype = fileTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG and PNG images are allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.route('/')
  .get(getInventory)
  .post(upload.single('picture'), createInventory);

router.route('/:id')
  .put(upload.single('picture'), updateInventory)
  .delete(deleteInventory);

router.route('/picture/:id')
  .get(getPicture);

module.exports = router;