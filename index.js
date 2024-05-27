const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');
// const dotenv = require('dotenv');

// dotenv.config({path: './config.env'})

connectToMongo();
const app = express();
const port = 9999;
app.use(cors());

app.use(express.json());

// Available Routes
const userRoutes = require('./routes/user');
const propertyRoutes = require('./routes/property');

app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);

app.get('/',(req,res) => {
    res.send('Hello World')
})

app.listen(port,()=>{
    console.log(`Example app listening at http://localhost:${port}`)
})

