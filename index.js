var express = require('express');
const cors = require('cors'); // Import the cors middleware

var app = express();

require('dotenv').config(); // Load environment variables from .env file

// Import the cron job module
require('./cronJob');


// routes import 
const candidateRoutes = require('./routes/candidateRoutes');

const authenticateToken = require('./middlewares/authMiddleware');




// connecting to database
const connectDB = require('./config/db');
connectDB();







// middleware 
app.use(cors());
// this code is for accepting data in port request
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(authenticateToken); // authentication 



// all the routes 
app.use('/api/candidates', candidateRoutes);
// admin routes

// app.use(adminBroApp);








app.get('/', function(req, res){
   res.send("Hello world!");
});



// app.use(admin.options.rootPath, adminRouter)


const port = process.env.PORT || 5000;

app.listen(port, "0.0.0.0" ,()=> {
    console.log(`Server is running on http://localhost:${port}`);
});