const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const AuthController = {
    async register(req, res) {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ error: 'Preencha todos os campos.' });

        try {
            const existing = UserModel.findByEmail(email);
            if (existing)
                return res.status(400).json({ error: 'E-mail já cadastrado.' });

            const hashed = await bcrypt.hash(password, 10);
            UserModel.create(name, email, hashed);
            return res.status(201).json({ message: 'Usuário criado com sucesso.' });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: err.message });
        }
    },

    async login(req, res) {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: 'Preencha todos os campos.' });

        try {
            const user = UserModel.findByEmail(email);
            console.log('USER DO BANCO:', user); // adiciona essa linha
            if (!user)
                return res.status(401).json({ error: 'Credenciais inválidas.' });

            const match = await bcrypt.compare(password, user.password);
            if (!match)
                return res.status(401).json({ error: 'Credenciais inválidas.' });

            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            return res.json({ token });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: err.message });
        }
    },
};

module.exports = AuthController;