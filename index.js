const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
app.use(express.json());
app.use(cors());

const uri =
  "mongodb+srv://userMangement:userMangement@cluster0.2m0rny5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const allCoffee = await client.db("coffeStore").collection("coffes");
    const allCarts = await client.db("coffeStore").collection("carts");
    const usersCollection = await client.db("coffeStore").collection("users");
    // get all the coffees
    app.get("/coffees", async (req, res) => {
      const coffee = await allCoffee.find().toArray();
      res.send(coffee);
    });
    // add coffee
    app.post("/coffees", async (req, res) => {
      const query = req.body;
      const result = await allCoffee.insertOne(query);
      res.send(result);
    });
    // delete coffee
    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allCoffee.deleteOne(query);
      res.send(result);
    });
    app.get('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allCoffee.findOne(query);
      res.send(result);
    })
    // update coffee
    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const coffee = req.body;
      const updateCoffee = {
        $set: {
          chef: coffee.chef,
          name: coffee.name,
          img: coffee.img,
          details: coffee.details,
          price: coffee.price,
          taste: coffee.taste,
          supplier: coffee.supplier,
        },
      };
      const result = await allCoffee.updateOne(query,updateCoffee,options)
      res.send(result);
    });
    // add to cart coffees
    app.post("/carts", async (req, res) => {
      const query = req.body;
      const result = await allCarts.insertOne(query);
      res.send(result);
    });
    // all carts data
    app.get("/carts", async (req, res) => {
      const result = await allCarts.find().toArray();
      res.send(result);
    });
    // delete items from carts
    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allCarts.deleteOne(query);
      res.send(result);
    });
    // add users 
    app.post('/users', async (req, res) => {
      const query = req.body
      console.log(query);
      const result = await usersCollection.insertOne(query);
      res.send(result);
    })
    // get all users 
    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    })
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Welcome to the server!");
});

app.listen(port, () => {
  console.log(`Listing on ${port}`);
});
