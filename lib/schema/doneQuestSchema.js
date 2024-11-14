const mongoose = require("mongoose");
const doneQuestSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  userId: { type: String, required: true },
});
const doneQuest = mongoose.model("doneQuest", doneQuestSchema);
doneQuest.syncIndexes();
module.exports = { doneQuest };
