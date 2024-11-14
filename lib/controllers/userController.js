const { User } = require("../schema/userSchema.js"); // Adjust the path accordingly
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Twowrzenie nowego użytkownika
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    console.log(req);

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    const token = jwt.sign(
      { id: newUser._id, name: newUser.name },
      process.env.secret,
      { expiresIn: "730h" }
    );
    res.status(200).json({ token, status: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
      return res.status(400).json({ message: "Brak adresu e-mail lub hasła" });
    }

    const user = await User.findOne({ email });
    let match = false;
    if (user) {
      match = await bcrypt.compare(password, user.password);
    }

    if (!user || !match) {
      return res.status(401).json({ message: "Nieprawidłowe dane logowania" });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.secret,
      { expiresIn: "730h" }
    );
    res.status(200).json({ token, status: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    if (!user) return res.status(404).json({ message: "User not found" });
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

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Usuwa użytkownika przez ID
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
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
  loginUser,
};
