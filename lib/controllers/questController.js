const jwt = require("jsonwebtoken");

const updateQuestStatus = async (req, res) => {
  try {
    // Pobranie nagłówka Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Brak tokena autoryzacji" });
    }

    // Zakładamy, że token jest w formacie "Bearer <token>", więc rozdzielamy
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Niepoprawny token" });
    }

    const decoded = jwt.verify(token, process.env.secret); // jeśli używasz JWT
    if (!decoded) {
      return res.status(403).json({ message: "Nieprawidłowy token" });
    }

    // Robisz ze dodaje typowi w bazie danych streaka + 1 (dodatkowa baza ze streakami, idTypa [mongodb uid, _id czy jakos tak], ilosc) Musisz sprawdzic czy ma aktywny rekord czy dodac nowy
    // W bazie z wykonanymi questami z data dodaje typowi ze zostal wykonany (kolejna baza (idTypa, data))
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  updateQuestStatus,
};
