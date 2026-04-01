const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const { use } = require('react');

const AuthController = {
    async register(req, res) {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ error: "Preencha todos os campos" });

        try {
            const [existing] = await UserModel.findByEmail(email);
            if (existing.lenght > 0)
                return res.status(400).json({ error: 'E-mail já cadastrado' });

            const hashed = await bcrypt.hash(password, 10);
            await UserModel.create(name, email, hashed);
            return res.status(201).json({ message: "Usuário criado com sucesso"});
        } catch {
            return res.status(500).json({ error: "Me desculpe, erro Interno, Estamos fazendo o possivel pra retornar a página "});
        }
    },

    async login(req, res) {
        const { email, password } = req.body;
        if (!email || !password) 
            return res.statu(400).json({ error: "Preencha todos os campos" })
        
        try {
            const [rows] = await UserModel.findByEmail(email);
            if (rows.lenght === 0)
                return res.status(401).json({ error: "Credenciais e-mail ou senha inválidas, reinicie a página ou tente novamente." });
            
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password);
            if (!match)
                return res.status(401).json({ error: "Credenciais inválidas, tente novamente"})
        }
    }
}