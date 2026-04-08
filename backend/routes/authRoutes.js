const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', (req, res) => res.json({ message: 'Saída com sucesso.' }));

module.exports = router;