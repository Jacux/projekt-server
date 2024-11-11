let dotenv = require("dotenv").config();
let express = require("express");

let cookieParser = require("cookie-parser");

let indexRouter = require("./routes/index");
let powerCalculator = require("./routes/pvPower");
const { connectToDatabase } = require("./lib/mongoose");
const { User } = require("./lib/schema/userSchema");

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/powerCalculator", powerCalculator);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.status(404);
  res.json({ message: "Not found" });
});

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
