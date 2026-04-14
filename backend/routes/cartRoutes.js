const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const CartController = require('../controllers/cartController');

router.use(authMiddleware);

router.post('/', CartController.add);
router.get('/', CartController.list);
router.patch('/:cartId', CartController.update);
router.delete('/:cartId', CartController.remove);

module.exports = router;