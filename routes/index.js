var express = require("express");
var router = express.Router();
const {
  connectToDatabase,
  disconnectFromDatabase,
} = require("../lib/mongoose");
const { User } = require("../lib/schema/userSchema");

router.get("/", async function (req, res) {
  try {
    await connectToDatabase();

    const newUser = new User({
      name: "Janek Darok",
      email: "janek.darok@3c.com",
      password: "kaki3232",
    });

    await newUser.save();
    console.log("User saved:", newUser);

    const users = await User.find({});
    console.log("All users:", users);
    res.json(users);
  } catch (error) {
    console.error("Error during database operation:", error);
  } finally {
    await disconnectFromDatabase();
  }
});

module.exports = router;
