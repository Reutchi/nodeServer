const jwt = require('jsonwebtoken');
const users = require('../models/userModel');
const multer = require('multer');
const bcrypt = require('bcrypt');

const secretKey = 'secretKey';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const register = (req, res) => {
    const { name, password, email } = req.body;
    const avatar = req.file && req.file.buffer;

    if (!name || !password || !email || !avatar) {
        return res.status(400).json({ error: 'Toate câmpurile sunt obligatorii.' });
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ error: 'Acest email este deja înregistrat.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = { name, password: hashedPassword, email, avatar };

    const token = jwt.sign({ email: newUser.email }, secretKey);

    newUser.token = token;

    users.push(newUser);

    res.status(201).json({ message: 'Utilizator înregistrat cu succes.', token });
};

const login = (req, res) => {
    const { email, password } = req.body;

    const user = users.find(user => user.email === email);

    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ email: user.email }, secretKey);
        res.status(200).json({ message: 'Autentificare reușită.', token });
    } else {
        res.status(401).json({ error: 'Adresa de e-mail sau parola incorectă.' });
    }
};

const getUsers = (req, res) => {
    res.status(200).json(users);
};

module.exports = {
    register: upload.single('avatar'),
    processRegistration: register,
    login,
    getUsers
};
