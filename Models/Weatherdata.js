const { MongoClient } = require('mongodb');

require("dotenv").config();

async function Connection(){
    client = new MongoClient('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.2/');
    await client.connect();  
    const db = client.db('Movie');
    
    const collection = db.collection("weathers");
    return collection;
}
async function AddDATA(data){
    let collection=await Connection();
    const result1 = await collection.insertOne({ Weather:data});    
    client.close();
    return result1;
}
module.exports= AddDATA;