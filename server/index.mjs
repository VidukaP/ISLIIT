import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const PORT = Number(process.env.PORT ?? 4000);
const MONGO_URI = process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017";
const DB_NAME = process.env.DB_NAME ?? "tailadmin_demo";

const { default: app } = await import("./src/app.mjs");

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    dbName: DB_NAME,
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
  })
  .then(async () => {
    console.log(`✓ Connected to MongoDB: ${DB_NAME}`);
    // Drop problematic index if it exists
    try {
      const db = mongoose.connection.db;
      const indexes = await db.collection('questions').listIndexes().toArray();
      const badIndex = indexes.find(idx => 
        idx.name && idx.name.includes('title_text') && idx.key.tags !== undefined
      );
      if (badIndex) {
        await db.collection('questions').dropIndex(badIndex.name);
        console.log(`✓ Dropped problematic text index on questions collection`);
      }
    } catch (err) {
      // Index might not exist, that's okay
      if (!err.message.includes('index not found')) {
        console.error(`Error managing indexes: ${err.message}`);
      }
    }
  })
  .catch((err) => {
    console.warn(`⚠ MongoDB connection failed, using mock mode. Error: ${err.message}`);
    // Continue without database - will return mock/empty responses
  });

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
