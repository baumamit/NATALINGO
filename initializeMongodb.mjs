// # INITIALIZE MONGODB STORAGE SERVER ON PAGE RESTART

export function mongoDBinitialize() {
  
  const username = encodeURIComponent("baumamit");
  const password = encodeURIComponent("Amit1986");
  const { MongoClient, ServerApiVersion } = require('mongodb');
  const uri = `mongodb+srv://${username}:${password}@natalingo.nhe5dr3.mongodb.net/?retryWrites=true&w=majority&appName=NATALINGO`;

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
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);
}