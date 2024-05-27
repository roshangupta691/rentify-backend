const mongoose = require("mongoose");
const mongoURI =
  "mongodb+srv://roshan:Roshan%40123@cluster0.98icegk.mongodb.net/rentify?retryWrites=true&w=majority&appName=Cluster0";

const connectToMongo = () => {
  mongoose
    .connect(mongoURI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("Mongo Error", err));
};

module.exports = connectToMongo;
