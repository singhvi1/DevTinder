const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://vikashKumar:Vikash1234@namastenode.hdioqxx.mongodb.net/devTinder"
  );
};


module.exports={
    connectDB,
}

