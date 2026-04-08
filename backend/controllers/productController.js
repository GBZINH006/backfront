const ProductModel = require('../models/productModel');

const ProductController = {
  async getAll(req, res) {
    try {
      const products = ProductModel.findAll();
      res.json(products)
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar Produto :(" });
    }
  },

  async getById(req, res) {
    try {
      const product = ProductModel.findById(req.params.id);
      if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
      res.json(product)
    } catch {
      res.status(500).json({ error: 'Erro ao buscar produto estamos fazendo o possivel pra encontrar o produto.' });
    }
  },

  async create(req, res) {
    const { name, description, price} = req.body;
    if(!name || !price)
      return res.status(400).json({ error: 'Nome e preço são obrigatórios.' });
    try {
      const image = req.file ? `/uploads/${req.file.filename}` : product.image;
      ProductModel.update(req.params.id, name, description, price, image);
      res.json({ message: 'Produto atualizado com sucesso.'});
    } catch {
      res.status(500).json({ error: 'Erro ao atualizar o produto, estamos verificando...' })
    }
  },
  async delete(req, res) {
    try {
      const product = ProductModel.findById(req.params.id);
      if (!product) return res.status(404).json({ error: 'Produto não encontrado' })
        ProductModel.delete(req.params.id);
      res.json({ message: "Produto deletado com sucesso." })
    } catch {
      res.status(500).json({ error: 'Erro ao deletar produto.' });
    }
  },
};

module.exports = ProductController;