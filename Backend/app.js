const express = require('express');
const app=express();

const path =require("path");
const dotenv =require("dotenv");
const databaseConnection = require('./config/Dbconnection');
const User=require("./routes/UserRoute");
const cors=require("cors");

dotenv.config({path:path.join(__dirname,"config","config.env")});

databaseConnection();
 app.use(express.json())
 app.use(cors())
app.get('/',(req,res,next)=>{
 res.send("<h1>Hello Mapla</h1>")}
       )
app.use('/api/users',User);
app.listen(process.env.PORT ||2000,()=>{
console.log(`Server Created SuceessFully ${process.env.PORT}`);

})
