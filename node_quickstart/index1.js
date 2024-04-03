// Replace the uri string with your connection string.
const username = encodeURIComponent("baumamit");
const password = encodeURIComponent("Amit1986");
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${username}:${password}@natalingo.nhe5dr3.mongodb.net/?retryWrites=true&w=majority&appName=NATALINGO`;

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('sample_mflix');
    const movies = database.collection('movies');

    // Query for a movie that has the title 'Back to the Future'
    const query = { title: 'Back to the Future' };
    const movie = await movies.findOne(query);

    console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);