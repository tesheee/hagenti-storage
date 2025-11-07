import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
let clientPromise: Promise<MongoClient>;

console.log("Mongo URI:", process.env.MONGODB_URI);

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

export const connectDB = async () => {
  const mongo = await clientPromise;
  return mongo.db();
};
