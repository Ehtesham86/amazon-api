// Import packages
const express = require("express");
const home = require("./routes/home");
require('dotenv').config(); // Load environment variables
 const productRoutes = require('./routes/productRoutes'); // Import routes
const cors = require('cors');

const app = express();
// const PORT = process.env.PORT || 3000;
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000' // Replace   
   }));
  
// Middlewares
app.use('/api', productRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to the Amazon Product API!');
});

 

// Routes
app.use("/home", home);

// connection
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening to port ${port}`));
