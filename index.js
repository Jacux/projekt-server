let dotenv = require("dotenv").config();
let express = require("express");

let cookieParser = require("cookie-parser");

let indexRouter = require("./routes/index");
let powerCalculator = require("./routes/pvPower");

const { connectToDatabase } = require("./lib/mongoose");
const { User } = require("./lib/schema/userSchema");
const {
  loginUser,
  createUser,
  addDoneQuest,
  checkQuest,
} = require("./lib/controllers/userController");

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.get("/time", (req, res) => {
  const event = new Date();
  console.log(event.toString());

  console.log(event.toISOString());

  res.json({ e1: event.toString(), e2: event.toISOString() });
});
app.post("/loginUser", loginUser);
app.post("/createUser", createUser);
app.post("/addDoneQuest", addDoneQuest);
app.get("/checkQuest", checkQuest);

app.listen(process.env.port, () => {
  console.log(`Example app listening on port ${process.env.port}`);
});

async function startServer() {
  try {
    await connectToDatabase();
    User.createIndexes();
  } catch (error) {}
}

var cron = require('node-cron');
function quest()
{
  alert('Masz nowe zadanie!')
}

cron.schedule('0 1 * *', () => 
{
  quest(),
  {
    scheduled: true
  }
})
startServer();
