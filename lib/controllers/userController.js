const { User } = require('./path_to_user_model'); // Adjust the path accordingly
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Twowrzenie nowego użytkownika
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Hashowanie hasła
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Pobiera wsztstkich użytkowników
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Pobiera użytkowników przez ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Aktualizuje użytkowników przez ID
const updateUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const updateData = { name, email };

        if (password) {
            // Hashuje hasło
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Usuwa użytkownika przez ID
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eksportuje metody kontrolera
module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};