// dbconnection.js
const { MongoClient } = require("mongodb");

// Connection URI (change if needed)
const uri = "mongodb://localhost:27017/";

// Database and Collection Names
const dbName = "testdb";
const collectionName = "users";

// Create MongoClient
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // 1️⃣ Insert a document
    const newUser = { name: "John Doe", age: 28, city: "Chennai" };
    const insertResult = await collection.insertOne(newUser);
    console.log("Inserted:", insertResult.insertedId);

    // 2️⃣ Find documents
    const users = await collection.find().toArray();
    console.log("Users:", users);

    // 3️⃣ Update a document
    const updateResult = await collection.updateOne(
      { name: "John Doe" },
      { $set: { age: 29 } }
    );
    console.log("Updated:", updateResult.modifiedCount);

    // 4️⃣ Delete a document
    const deleteResult = await collection.deleteOne({ name: "John Doe" });
    console.log("Deleted:", deleteResult.deletedCount);

  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    // Close connection
    await client.close();
    console.log("🔒 MongoDB connection closed");
  }
}

run();
