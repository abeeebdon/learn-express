import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();
let _db = null;
export const connectDB = async () => {
  if (!_db) {
    const connectionString = process.env.MONGO_URI;
    const db_name = process.env.db_name;
    const client = await MongoClient.connect(connectionString);
    _db = client.db(db_name);
  }
  return _db;
};
export const ping = async () => {
  const db = await connectDB();
  await db.command({ ping: 1 });
  console.log("pinged");
};
ping();
