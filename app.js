let express = require('express');
let app = express();
let port = process.env.PORT||9120;
let Mongo = require('mongodb')
const bodyParser = require('body-parser');
const cors = require('cors');
let {dbConnect,getData,postData,updateOrder,deleteOrder} = require('./controller/dbController')

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors())

app.get('/',(req,res) => {
    res.send('Hiii From Express')
})

//getting all location of croma stores
app.get('/location_stores',async (req,res)=>{
    let query = {};
    let collection = "location_stores"
    let output = await getData(collection,query)
    res.send(output)
})

//getting all croma stores data and according to their location also
app.get('/stores',async(req,res)=>{
    let query={};
    if(req.query.locationid){
        query={location_id:Number(req.query.locationid)}
     }
     else{
         query={}
     }

     let collection="stores";
     let output=await getData(collection,query);
     res.send(output);
})

//getting data of all categories of products
app.get('/category',async (req,res)=>{
    let query = {};
    let collection = "category"
    let output = await getData(collection,query)
    res.send(output)
})

//getting data of all Sub-categories of products
app.get('/subCategory',async(req,res)=>{
    let query={};
    if(req.query.categoryid){
        query={category_id:Number(req.query.categoryid)}
     }
     else{
         query={}
     }

     let collection="subCategory";
     let output=await getData(collection,query);
     res.send(output);
})

//getting data of all products according to differnt conditions
app.get('/products',async(req,res)=>{
    let query={};
    if(req.query.categoryid && req.query.subcategoryid){
        query={category_id:Number(req.query.categoryid),sub_category_id:Number(req.query.subcategoryid)}
     }
    else if(req.query.categoryid){
        query={category_id:Number(req.query.categoryid)}
     }
     else{
         query={}
     }

     let collection="products";
     let output=await getData(collection,query);
     res.send(output);
})

//getting orders
app.get('/orders',async(req,res) => {
    let query = {};
    if(req.query.email){
        query={email:req.query.email}
    }else{
        query = {}
    }
   
    let collection = "orders";
    let output = await getData(collection,query);
    res.send(output)
})

//placing orders
app.post('/placeOrder',async(req,res) => {
    let data = req.body;
    let collection = "orders";
    let response = await postData(collection,data)
    res.send(response)
})

//getting details of all products selected for an order
app.post('/productDetails',async(req,res) => {
    if(Array.isArray(req.body.id)){
        let query = {product_id:{$in:req.body.id}};
        let collection = 'products';
        let output = await getData(collection,query);
        res.send(output)
    }else{
        res.send('Please Pass data in form of array')
    }
})

//Updating details of orders placed
app.put('/updateOrder',async(req,res) => {
    let collection = 'orders';
    let condition = {"_id":new Mongo.ObjectId(req.body._id)}
    let data = {
        $set:{
            "status":req.body.status
        }
    }
    let output = await updateOrder(collection,condition,data)
    res.send(output)
})

//deleting orders
app.delete('/deleteOrder',async(req,res) => {
    let collection = 'orders';
    let condition = {"_id":new Mongo.ObjectId(req.body._id)}
    let output = await deleteOrder(collection,condition)
    res.send(output)
})

app.listen(port,(err) => {
    dbConnect()
    if(err) throw err;
    console.log(`Server is running on port ${port}`)
})