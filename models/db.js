// models/db.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);

let db;

async function connect() {
  await client.connect();
  db = client.db('quizAppDB'); 
}

function getCollection(name) {
  return db.collection(name); 
}

module.exports = { connect, getCollection };
