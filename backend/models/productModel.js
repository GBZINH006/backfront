const db = require('../config/db');

const ProductModel = {
  findAll: () => db.prepare('SELECT * FROM products').all(),
  findById: (id) => db.prepare('SELECT * FROM products WHERE id = ?').get(id),
  create: (name, description, price, image) =>
    db.prepare('INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)').run(name, description, price, image),
  update: (id, name, description, price, image) =>
    db.prepare('UPDATE products SET name = ?, description = ?, price = ?, image = ? WHERE id = ?').run(name, description, price, image, id),
  delete: (id) => db.prepare('DELETE FROM products WHERE id = ?').run(id),
};

module.exports = ProductModel;