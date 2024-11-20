import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
let isConnected = false;

export async function connectToDatabase() {
    if (!isConnected) {
        await client.connect();
        isConnected = true;
    }
    const db = client.db("chatbotDB");
    return { db, client };
}
