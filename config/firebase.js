
// Step 2: Create a new file: config/firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json'); // You'll get this file from Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
  
});

module.exports = admin;

