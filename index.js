// basic requirment for server side
const express = require('express');
const cors = require('cors');
const app = express();
const port=process.env.PORT||5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// requiring env
require('dotenv').config();
// console.log(process.env.MGDB_USER)
// console.log(process.env.MGDB_PASS)

// middle ware army

app.use(cors());
app.use(express.json());



// for category browsing by

const categories=[
    {id:1, name:"Dog", img:"https://i.ibb.co/hKRLtx1/category-dog.jpg"},
    {id:2, name:"Cat", img:"https://i.ibb.co/Js9nNX0/category-cat.jpg"},
    {id:3, name:"Rabbit", img:"https://i.ibb.co/pWQzkW8/category-rabbit.jpg"},
    {id:4,  name:"Bird", img:"https://i.ibb.co/7JmJdXZ/category-bird.jpg"},
  ]
  
  app.get('/categories',(req,res)=>{
    res.send(categories)
   })

// mongodb server
const uri = `mongodb+srv://${process.env.MGDB_USER}:${process.env.MGDB_PASS}@cluster0.skku3ga.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// mongodb actions function

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // creating Database for PetCo project
    const database = client.db("petCoDB");
    // collections
    const allPets = database.collection("allPets");

    // post method to add pet in database
    app.post('/addPet', async(req,res)=>{
      const pet=req.body;
      console.log(pet)
      const result = await allPets.insertOne(pet);
      res.send(result);
    });

    // using get method to loading allPets from Database send to clientside
    app.get('/allPets', async(req,res)=>{
      const cursor=allPets.find()
      const allpets= await cursor.toArray();
      res.send(allpets);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// checking server running in port

app.get("/", (req, res)=>{
    res.send("PetCo server is running on a port,check it out")
});

app.listen(port,()=>{
    console.log("Petco server is running now")
});
