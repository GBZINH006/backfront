const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.use(authMiddleware);

router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);
router.post('/', upload.single('image'), ProductController.create);
router.put('/:id', upload.single('image'), ProductController.update);
router.delete('/:id', adminMiddleware, ProductController.delete);

module.exports = router;