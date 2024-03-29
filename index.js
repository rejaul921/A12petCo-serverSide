// basic requirment for server side
const express = require('express');
const cors = require('cors');
const app = express();
const port=process.env.PORT||5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
      // console.log(pet)
      const result = await allPets.insertOne(pet);
      res.send(result);
    });

    // using get method to loading allPets from Database send to clientside
    app.get('/allPets', async(req,res)=>{
      const cursor=allPets.find()
      const allpets= await cursor.toArray();
      res.send(allpets);
    })

    // all users reading
    app.get('/allUsers', async(req,res)=>{
      const cursor=usersCollection.find()
      const allUsers= await cursor.toArray();
      res.send(allUsers);
    })

    // for PetDetails loading single Pet data from database
    app.get('/petDetails/:_id', async(req, res)=>{
      const id=req.params._id
      const query = { _id: new ObjectId(id) };
      const pet= await allPets.findOne(query)
      res.send(pet);
    })

    // receiving adoption request
    // collections
    const Adopters = database.collection("Adopters");
    app.post('/addAdoptionRequest', async(req,res)=>{
      const AdopterRequest=req.body;
      // console.log(AdopterRequest)
      const result = await Adopters.insertOne(AdopterRequest);
      res.send(result);
    });
    // reading adopters request for dashboard
    app.get('/adopttionRequest', async(req,res)=>{
      const cursor=Adopters.find()
      const allRequest= await cursor.toArray();
      res.send(allRequest);
    })

    // category wise pets loading
    app.get('/categories/:name', async(req,res)=>{
      const categoryName=req.params.name
      const query={petCategory:categoryName}
      const petsInCategory=await allPets.find(query).toArray()
      res.send(petsInCategory);
    })

     // collections
     const allDonations = database.collection("allDonations");

     // post method to add Campaign in database
     app.post('/addCampaign', async(req,res)=>{
       const campaign=req.body;
       // console.log(campaign)
       const result = await allDonations.insertOne(campaign);
       res.send(result);
     });

     // using get method to loading allDonationCampaign from Database send to clientside
    app.get('/allCampaign', async(req,res)=>{
      const cursor=allDonations.find()
      const donations= await cursor.toArray();
      res.send(donations);
    })
    // for Donation Campaign Details loading single campaign data from database
    app.get('/donationDetails/:_id', async(req, res)=>{
      const id=req.params._id
      const query = { _id: new ObjectId(id) };
      const donateCampaign= await allDonations.findOne(query)
      res.send(donateCampaign);
    })
    // post method to add user in database
    // collections name
    const usersCollection = database.collection("usersCollection");
     app.post('/users', async(req,res)=>{
       const user=req.body;
       // console.log(user)
      //  query and if find user return him
       const query={email: user.email}
       const userInDatabase=await usersCollection.findOne(query)
       if(userInDatabase){
        return res.send({message:"user already in database"})
       }
      //  else store in data
       const result = await usersCollection.insertOne(user);
       res.send(result);
     });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
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
