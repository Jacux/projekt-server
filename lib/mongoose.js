/* const mongoose = require('mongoose');
const uri = "mongodb+srv://filipkranki:123@projectg.cpt2v.mongodb.net/?retryWrites=true&w=majority&appName=projectG";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}
run().catch(console.dir); */

// db.js
const mongoose = require("mongoose");

const uri =
  "mongodb+srv://jacux:12345test@cluster0dsaa.n2wey.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0dsaa";
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

// Define a User model

async function connectToDatabase() {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // Rethrow the error for handling in the caller
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
