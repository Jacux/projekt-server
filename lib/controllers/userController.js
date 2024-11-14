const { User } = require("../schema/userSchema.js"); // Adjust the path accordingly
const { doneQuest } = require("../schema/doneQuestSchema.js");
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
const addDoneQuest = async (req, res) => {
  try {
    // Pobranie nagłówka Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Brak tokena autoryzacji" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Niepoprawny token" });
    }

    const decoded = jwt.decode(token, process.env.secret);
    if (!decoded) {
      return res.status(403).json({ message: "Nieprawidłowy token" });
    }
    const quest = new doneQuest({
      userId: decoded.id,
      date: new Date(),
    });

    await quest.save();
    await quest.updateOne({ _id: quest._id }, { $currentDate: { date: true } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eksportuje metody kontrolera
module.exports = {
  createUser,
  loginUser,
  addDoneQuest,
};
