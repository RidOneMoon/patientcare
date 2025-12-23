import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;


if (!uri && process.env.NODE_ENV === "production") {
  console.warn("Please add your MONGODB_URI to environment variables");
}


const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri || "mongodb://localhost:27017", options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function connectToDatabase() {
  const client = await clientPromise;
  return client.db("patientcare_db"); 
}

export default clientPromise;