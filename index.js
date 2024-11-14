let dotenv = require("dotenv").config();
let express = require("express");

let cookieParser = require("cookie-parser");

let indexRouter = require("./routes/index");
let powerCalculator = require("./routes/pvPower");

const { connectToDatabase } = require("./lib/mongoose");
const { User } = require("./lib/schema/userSchema");
const { loginUser, createUser } = require("./lib/controllers/userController");

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
pp.use("/time", indexRouter);
app.post("/loginUser", loginUser);
app.post("/createUser", createUser);

app.listen(process.env.port, () => {
  console.log(`Example app listening on port ${process.env.port}`);
});

async function startServer() {
  try {
    await connectToDatabase();
    User.createIndexes();
  } catch (error) {}
}

startServer();
