const jwt = require("jsonwebtoken");

const updateQuestStatus = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Brak tokena autoryzacji" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Niepoprawny token" });
    }

    const decoded = jwt.verify(token, process.env.secret); 
    if (!decoded) {
      return res.status(403).json({ message: "Nieprawidłowy token" });
    }

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  updateQuestStatus,
};
