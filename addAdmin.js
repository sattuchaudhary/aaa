// You can run this script once to create an admin
const mongoose = require('mongoose');
const Admin = require('./models/admin');


mongoose.connect('mongodb://localhost:27017/mlm_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const createAdmin = async () => {
  try {
    await Admin.create({
      username: 'admin',
      password: '1234',
      email: 'admin@example.com'
    });
    console.log('Admin created successfully');
  } catch (error) {
    console.error('Error creating admin:', error);
  }
};

createAdmin();