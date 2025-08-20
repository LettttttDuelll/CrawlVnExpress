import{ MongoClient, ServerApiVersion } from 'mongodb';
import newsData from './news3.0.json' assert { type: 'json' };

import dotenv from 'dotenv';
dotenv.config();
// Connection URI

const uri = linkdb ;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
    //create or access the database
    const news = client.db("news");

    //create or access the collection
    const collection = news.collection("vnexpress");

    // Insert the JSON data into the collection
    const result = await collection.insertMany(newsData);
    
    //check the inserted data
    console.log(`✅ Imported ${result.insertedCount} documents`);

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
