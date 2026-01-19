import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const options = {};

// Safety check
if (!uri) {
  throw new Error("❌ Please define MONGO_URI in your environment variables");
}

// Global cached connection (VERY IMPORTANT for Next.js / Vercel)
let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // Reuse connection in development (hot reload safe)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // New connection in production
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("betterHousing"); // DB name
    const companies = db.collection("companies");

    const data = req.body;

    /* ---------------- VALIDATION (MINIMUM REQUIRED) ---------------- */

    if (!data.companyName || !data.emailAddress) {
      return res.status(400).json({
        error: "Missing required fields (companyName, emailAddress)",
      });
    }

    // Normalize preferredCity → always array
    if (data.preferredCity && !Array.isArray(data.preferredCity)) {
      data.preferredCity = [data.preferredCity];
    }

    /* ---------------- INSERT ---------------- */

    const result = await companies.insertOne({
      ...data,
      createdAt: new Date(), // UTC timestamp (correct practice)
    });

    return res.status(201).json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error("❌ MongoDB insert error:", err);
    return res.status(500).json({ error: "Database error" });
  }
}
