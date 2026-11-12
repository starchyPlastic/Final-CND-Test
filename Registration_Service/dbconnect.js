// STEP-1 : IMPORT MONGOOSE PACKAGE
const mongoose = require('mongoose');

// Database Connection URL (MongoDB Atlas)
const uri = "mongodb+srv://Database:GZEFU2vIxw48WRXP@cluster0.j1trcer.mongodb.net/?appName=Cluster0";

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
  try {
    // STEP-2 : ESTABLISH CONNECTION WITH MONGODB DATABASE THROUGH MONGOOSE
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Keep connection open – do NOT disconnect
  }
}
run().catch(console.dir);

// STEP-3 : EXPORT MODULE mongoose (needed in other JS files)
module.exports = mongoose;

