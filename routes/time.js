var router = express.Router();

/* GET users listing. */
router.get("/time", async function (req, res) {
  const event = new Date();
  console.log(event.toString());
  // Expected output: "Wed Oct 05 2011 16:48:00 GMT+0200 (CEST)"
  // Note: your timezone may vary

  console.log(event.toISOString());

  res.json({ e1: event.toString(), e2: event.toISOString() });
});

module.exports = router;
