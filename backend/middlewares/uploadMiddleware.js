const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `product-${Date.now()}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Formato Inválido.'));
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024} });