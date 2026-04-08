const db = require('../config/db');

const ProductModel = {
  findAll: () => {
    return db.prepare('SELECT * FROM products').all();
  },
  findById: (id) => {
    return db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  },
  create: (name, description, price) => {
    return db.prepare('INSERT INTO products (name, description, price) VALUES (?, ?, ?)').run(name, description, price);
  },
  update: (id, name, description, price) => {
    return db.prepare('UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?').run(name, description, price, id);
  },
  delete: (id) => {
    return db.prepare('DELETE FROM products WHERE id = ?').run(id);
  },
};

module.exports = ProductModel;