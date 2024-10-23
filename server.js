

//server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const Product = require('./models/Product');
const admin = require('./config/firebase');

// Connect to MongoDB





dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "local_mongodb_uri", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);


// API endpoint to get all products
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});



const productRoutes = require('./routes/ProductRoutes');
app.use('/api', productRoutes);

const myProductRoutes = require('./routes/myProductRoutes');
app.use('/api', myProductRoutes);

// const bankAccountRoutes = require('./routes/bankAccountRoutes');
// app.use('/api/bank-accounts', bankAccountRoutes);


const rechargeRoutes = require('./routes/rechargeRoutes');
app.use('/api', rechargeRoutes);

const withdrawRoutes = require('./routes/withdrawRoutes');
app.use('/api', withdrawRoutes);


// const adminRoutes = require('./routes/adminRoutes');
// app.use('/api/admin', adminRoutes);

//admin routes
// const adminRoutes = require('./routes/adminRoutes');
// app.use('/api/admin', adminRoutes);




// Start the server

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



