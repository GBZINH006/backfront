const db = require('../config/db');

const UserModel = {
  findByEmail: (email) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  },
  create: (name, email, hashedPassword) => {
    const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    return stmt.run(name, email, hashedPassword);
  },
};

module.exports = UserModel;