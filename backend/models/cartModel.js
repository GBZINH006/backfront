const db = require('../config/db');

const CartModel = {
    addItem: (userId, productId, quantity = 1) => {
        const existing = db.prepare(
            'SELECT * FROM cart WHERE user_id = ? AND product_id = ?'
        ).get(userId, productId);

        if (existing) {
            return db.prepare(
                'UPDATE cart SET quantity = quantity + ? WHERE id = ?'
            ).run(quantity, existing.id);
        }

        return db.prepare(
            'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)'
        ).run(userId, productId, quantity);
    },

    getItems: (userId) =>
        db.prepare(
            'SELECT c.id, c.quantity, p.* FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?'
        ).all(userId),

    updateQuantity: (cartId, quantity) =>
        db.prepare('UPDATE cart SET quantity = ? WHERE id = ?').run(quantity, cartId),

    removeItem: (cartId) =>
        db.prepare('DELETE FROM cart WHERE id = ?').run(cartId),
};

module.exports = CartModel;