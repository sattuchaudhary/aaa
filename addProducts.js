// server/addProducts.js
const mongoose = require('mongoose');
const Product = require('./models/Product');


mongoose.connect('mongodb://localhost:27017/mlm_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const products = [
  { name: 'Sattu-1', price: 1000, dailyIncome: 50, validity: 30, totalRevenue: 1500 },
  { name: 'Sattu-2', price: 2000, dailyIncome: 80, validity: 30, totalRevenue: 2400 },
  { name: 'Sattu-3', price: 3000, dailyIncome: 120, validity: 30, totalRevenue: 3600 }
  
];

Product.insertMany(products)
  .then(() => {
    console.log('Sample products added successfully');
    mongoose.connection.close();
  })
  .catch(err => console.error('Error adding sample products:', err));
