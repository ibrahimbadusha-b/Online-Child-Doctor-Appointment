const express = require('express');
const app = express();

const path = require("path");
const dotenv = require("dotenv");
const databaseConnection = require('./config/Dbconnection');
const User = require("./routes/UserRoute");
// In your main server file (app.js, index.js, server.js)
const cors = require('cors');
const PORT =process.env.PORT || 2000;

const corsOptions = {
      origin: [
            'https://online-child-doctor-appointment.vercel.app'
      ],
      credentials: true,                  
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};




dotenv.config({ path: path.join(__dirname, "config", "config.env") });

databaseConnection();
app.use(express.json())
app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.get('/', (req, res, next) => {
      res.send("<h1>Hello Mapla</h1>")
}
)
app.use('/api/users', User);
app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server Created SuceessFully ${process.env.PORT}`);

})
