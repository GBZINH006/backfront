const db = require('../config/db');

const UserModel = {

  findByEmail(email) {
    return db
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email);
  },

  create(name, email, password) {
    return db
      .prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)')
      .run(name, email, password);
  }

};

module.exports = UserModel;