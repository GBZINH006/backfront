const CartModel = require('../models/cartModel');

const CartController = {
    add: (req, res) => {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        try {
            CartModel.addItem(userId, productId, quantity);
            res.json({ message: 'Produto adicionado ao carrinho!' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    list: (req, res) => {
        const userId = req.user.id;
        try {
            const items = CartModel.getItems(userId);
            res.json(items);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    update: (req, res) => {
        const { cartId } = req.params;
        const { quantity } = req.body;
        try {
            CartModel.updateQuantity(cartId, quantity);
            res.json({ message: 'Quantidade atualizada!' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    remove: (req, res) => {
        const { cartId } = req.params;
        try {
            CartModel.removeItem(cartId);
            res.json({ message: 'Produto removido do carrinho!' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};

module.exports = CartController;