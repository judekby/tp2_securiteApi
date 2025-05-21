const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();
const { generateToken } = require('../utils/jwt');
const authenticateToken = require('../middleware/auth');
const validateUserInput = require('../middleware/validate');

// Simulation d'une base de données (en mémoire)
const users = [];

router.post('/register', validateUserInput, async (req, res) => {
  const { username, password } = req.body;

  const userExists = users.find(u => u.username === username);
  if (userExists) return res.status(409).json({ message: 'Utilisateur existe déjà' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: users.length + 1, username, password: hashedPassword };

  users.push(newUser);
  res.status(201).json({ message: 'Utilisateur créé avec succès' });
});

router.post('/login', validateUserInput, async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ message: 'Identifiants invalides' });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ message: 'Mot de passe incorrect' });

  const token = generateToken(user);
  res.json({ token });
});

router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Contenu protégé', user: req.user });
});

module.exports = router;