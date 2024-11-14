const { doneQuest } = require("../lib/controllers/userController");

var router = express.Router();

/* GET users listing. */
router.post("/doneQuest", async function (req, res) {
  createUser(req, res);
});

module.exports = router;
