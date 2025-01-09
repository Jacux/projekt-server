const mongoose = require("mongoose");

const uri =
  process.env.MONGODB_URI;
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function connectToDatabase() {
  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; 
  }
}

async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB!");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
  }
}

module.exports = {
  connectToDatabase,
  disconnectFromDatabase,
};
