const express = require('express');

const router = express.Router();

// Mock database
let products = [
    { id: 1, name: 'Arroz', price: 5.50, quantity: 100 },
    { id: 2, name: 'Feijão', price: 8.00, quantity: 75 },
    { id: 3, name: 'Leite', price: 4.50, quantity: 50 }
];

// GET all products
router.get('/', (req, res) => {
    res.json(products);
});

// GET product by id
router.get('/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
    res.json(product);
});

// POST new product
router.post('/', (req, res) => {
    const { name, price, quantity } = req.body;
    if (!name || !price || !quantity) {
        return res.status(400).json({ message: 'Dados inválidos' });
    }
    
    const newProduct = {
        id: products.length + 1,
        name,
        price,
        quantity
    };
    
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// PUT update product
router.put('/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
    
    Object.assign(product, req.body);
    res.json(product);
});

// DELETE product
router.delete('/:id', (req, res) => {
    products = products.filter(p => p.id !== parseInt(req.params.id));
    res.json({ message: 'Produto deletado' });
});

module.exports = router;