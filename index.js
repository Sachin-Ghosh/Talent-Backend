var express = require('express');
const cors = require('cors'); // Import the cors middleware
const path = require('path');
var app = express();

require('dotenv').config(); // Load environment variables from .env file

// Import the cron job module
require('./cronJob');


// Import route files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');
const jobRoutes = require('./routes/jobRoutes')
const interviewRoutes = require('./routes/interviewRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const employerRoutes = require('./routes/employerRoutes'); // Add this line
const screeningRoutes = require('./routes/screeningRoutes');
const testRoutes = require('./routes/testRoutes');
const interviewSlotRoutes = require('./routes/interviewSlotRoutes');
const blogRoutes = require('./routes/blogRoutes');



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



// Routes
app.use('/api/users', userRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api', applicationRoutes); // Note: This route doesn't have a prefix in the original file
app.use('/api/employers', employerRoutes);
app.use('/api/screening', screeningRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/interview-slots', interviewSlotRoutes);
app.use('/api/blogs', blogRoutes);
// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
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