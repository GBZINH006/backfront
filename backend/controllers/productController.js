const ProductModel = require('../models/productModel');

const ProductController = {
  async getAll(req, res) {
    try {
      const rows = await ProductModel.findAll(); // ✅ corrigido
      res.json(rows);
    } catch {
      res.status(500).json({ error: 'Erro ao buscar produtos.' });
    }
  },

  async getById(req, res) {
    try {
      const row = await ProductModel.findById(req.params.id); // ✅ corrigido
      if (!row) return res.status(404).json({ error: 'Produto não encontrado.' });
      res.json(row);
    } catch {
      res.status(500).json({ error: 'Erro ao buscar produto.' });
    }
  },

  async create(req, res) {
    const { name, description, price } = req.body;
    if (!name || !price)
      return res.status(400).json({ error: 'Nome e preço são obrigatórios.' });

    try {
      await ProductModel.create(name, description, price);
      res.status(201).json({ message: 'Produto criado com sucesso.' });
    } catch {
      res.status(500).json({ error: 'Erro ao criar produto.' });
    }
  },

  async update(req, res) {
    const { name, description, price } = req.body;
    if (!name || !price)
      return res.status(400).json({ error: 'Nome e preço são obrigatórios.' });

    try {
      const row = await ProductModel.findById(req.params.id); // ✅ corrigido
      if (!row) return res.status(404).json({ error: 'Produto não encontrado.' });

      await ProductModel.update(req.params.id, name, description, price);
      res.json({ message: 'Produto atualizado com sucesso.' });
    } catch {
      res.status(500).json({ error: 'Erro ao atualizar produto.' });
    }
  },

  async delete(req, res) {
    try {
      const row = await ProductModel.findById(req.params.id); // ✅ corrigido
      if (!row) return res.status(404).json({ error: 'Produto não encontrado.' });

      await ProductModel.delete(req.params.id);
      res.json({ message: 'Produto deletado com sucesso.' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = ProductController;