require('dotenv').config(); // Load environment variables
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_URI; // Use the environment variable 

// Create a MongoClient with a MongoClientOptions
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToDatabase() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

module.exports = { client, connectToDatabase };
