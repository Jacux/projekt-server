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
const moment = require("moment-timezone");

const addDoneQuest = async (req, res) => {
  try {
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

    const userId = decoded.id;

    // Użycie moment-timezone do uzyskania czasu w strefie 'Europe/Warsaw'
    const now = moment().tz("Europe/Warsaw");
    const startOfDay = now.clone().startOf("day"); // Początek dnia
    const endOfDay = now.clone().endOf("day"); // Koniec dnia

    const existingQuest = await doneQuest.findOne({
      userId: userId,
      date: { $gte: startOfDay.toDate(), $lte: endOfDay.toDate() },
    });

    if (existingQuest) {
      return res
        .status(409)
        .json({ message: "Rekord dla bieżącego dnia już istnieje" });
    }

    const quest = new doneQuest({
      userId: userId,
      date: new Date(),
    });

    await quest.save();
    res.status(200).json({ status: true, message: "Dodano rekord!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const checkQuest = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Brak tokena autoryzacji" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Niepoprawny token" });
    }

    // Dekodowanie tokenu
    const decoded = jwt.decode(token, process.env.secret);
    if (!decoded) {
      return res.status(403).json({ message: "Nieprawidłowy token" });
    }

    const userId = decoded.id;

    // Użycie moment-timezone do uzyskania czasu w strefie 'Europe/Warsaw'
    const now = moment().tz("Europe/Warsaw");
    const startOfDay = now.clone().startOf("day"); // Początek dnia
    const endOfDay = now.clone().endOf("day"); // Koniec dnia

    const existingQuest = await doneQuest.findOne({
      userId: userId,
      date: { $gte: startOfDay.toDate(), $lte: endOfDay.toDate() },
    });

    if (existingQuest) {
      return res
        .status(200)
        .json({ message: "Użytkownik wykonał zadanie dzisiaj" });
    } else {
      return res
        .status(200)
        .json({ message: "Użytkownik nie wykonał zadania dzisiaj" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  addDoneQuest,
  checkQuest,
};
