const { loginUser } = require("../lib/controllers/userController");

var router = express.Router();

/* GET users listing. */
router.post("/loginUser", async function (req, res) {
  loginUser(req, res);
});

module.exports = router;
