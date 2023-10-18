const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express() ;
const port = process.env.PORT || 5000 ;



app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.5y6t7ws.mongodb.net/?retryWrites=true&w=majority`;

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

    const productCollection = client.db("techInfoDB").collection("product")
    const cartCollection = client.db("techInfoDB").collection("cart")
    

    
    app.get ('/products/:id' , async (req, res) => {

        const id = req.params.id ;
        const query = {_id: new ObjectId(id)}
        const result = await productCollection.findOne(query);
        res.send(result);

    })
    app.put( '/products/:id' , async(req , res) => {
        const id = req.params.id;
      const filter = { _id : new ObjectId(id)} ;
        const options = { upsert: true };
        const updateProduct = req.body ;
        const product = {
            $set: {
             name : updateProduct.name ,
             brandName : updateProduct.brandName ,
             type : updateProduct.type ,
             image : updateProduct.image ,
             rating : updateProduct.rating ,
             price : updateProduct.price ,
             

            },
          };
          const result = await productCollection.updateOne(filter , product , options);
          res.send(result)
        
    })
    app.get('/products' , async(req , res) => {
        const cursor = productCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })


    app.post( '/products' , async (req , res) => {
        const product = req.body ;
        console.log(product)
        const result = await productCollection.insertOne(product);
        res.send(result);
        
    })
    app.get('/carts' , async(req , res) => {
        const cursor = cartCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.delete('/carts/:id' , async(req , res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await cartCollection.deleteOne(query);
        res.send(result)

    })

    app.post('/carts' ,async(req , res) => {
        const cart = req.body ;
        const result = await cartCollection.insertOne(cart);
        res.send(result)
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



app.listen( port , (req , res ) => {
    console.log(`database is running successfully , ${port}`)
})