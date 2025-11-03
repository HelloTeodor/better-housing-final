import { MongoClient } from "mongodb";

let cachedClient = null;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    if (!cachedClient) {
      cachedClient = new MongoClient(process.env.MONGO_URI);
      await cachedClient.connect();
    }

    const db = cachedClient.db("betterHousing");
    const companies = db.collection("companies");

    const allCompanies = await companies.find({}).toArray();

    // Return only necessary data
    res.status(200).json(allCompanies);
  } catch (err) {
    console.error("MongoDB error:", err);
    res.status(500).json({ error: "Database error" });
  }
}
