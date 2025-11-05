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
app.use(
  cors({
    origin: [
      "https://online-child-doctor-appointment.vercel.app", // frontend vercel url
      "http://localhost:3000" //testing in local devices
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


app.use('/api/users',User);
app.listen(process.env.PORT ||2000,'0.0.0.0',()=>{
console.log(`Server Created SuceessFully ${process.env.PORT}`);

})
