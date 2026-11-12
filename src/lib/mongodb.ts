import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI não configurada");
}

const client = new MongoClient(uri);

export const clientPromise = client.connect();
