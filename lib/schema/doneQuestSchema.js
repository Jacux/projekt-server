const mongoose = require("mongoose");
const doneQuestSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, maxlength: 120 },
  password: { type: String, required: true, minlength: 8 },
});
const doneQuest = mongoose.model("doneQuest", doneQuestSchema);
doneQuest.syncIndexes();
module.exports = { doneQuest };
