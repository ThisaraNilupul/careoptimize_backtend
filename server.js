const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const patientRoutes = require('./routes/patientRoutes');

//load env veriables
dotenv.config();

//connect to mongodb
connectDB();

const app = express();

//middleware
app.use(express.json());
app.use(cors());

//routes
app.use('/api/patient', patientRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));