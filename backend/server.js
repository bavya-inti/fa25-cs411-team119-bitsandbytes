const express = require('express');
const cors = require('cors');
require('dotenv').config();

const coursesRoutes = require('./routes/courses');

const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/courses', coursesRoutes);


const startServer = async () => {
  app.listen(PORT).on('error', (err) => {
    process.exit(1);
  });
};

startServer();

module.exports = app;

