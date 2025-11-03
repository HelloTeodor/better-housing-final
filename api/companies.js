import { MongoClient } from "mongodb";

// MongoDB connection string from environment variable
const client = new MongoClient(process.env.MONGO_URI);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db("betterHousing"); // your DB name
    const companies = db.collection("companies"); // collection name

    // Insert form data into MongoDB
    const result = await companies.insertOne(req.body);

    // Respond with success
    res.status(200).json({ insertedId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    await client.close();
  }
}
