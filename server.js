const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const registerRoute = require('./routes/registerRoute');

//load env veriables
dotenv.config();

//connect to mongodb
connectDB();

const app = express();

//middleware
app.use(express.json());
app.use(cors());

//routes
app.use('/api/', registerRoute);
app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));