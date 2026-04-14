const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const AuthController = {
  async register(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Preencha todos os campos.' });

    try {
      const [existing] = await UserModel.findByEmail(email);
      if (existing.length > 0)
        return res.status(400).json({ error: 'E-mail já cadastrado.' });

      const hashed = await bcrypt.hash(password, 10);
      await UserModel.create(name, email, hashed);
      return res.status(201).json({ message: 'Usuário criado com sucesso.' });
    } catch {
      return res.status(500).json({ error: 'Erro interno.' });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Preencha todos os campos.' });

    try {
      const [rows] = await UserModel.findByEmail(email);
      if (rows.length === 0)
        return res.status(401).json({ error: 'Credenciais inválidas.' });

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(401).json({ error: 'Credenciais inválidas.' });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      return res.json({ token });
    } catch {
      return res.status(500).json({ error: 'Erro interno.' });
    }
  },
};

module.exports = AuthController;