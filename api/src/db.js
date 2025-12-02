const mongoose = require("mongoose");
require("dotenv").config();

const user = process.env.MONGO_USER;
const pass = process.env.MONGO_PASSWORD;
const db = process.env.MONGO_DB;
const host = process.env.MONGO_HOST;
const port = process.env.MONGO_PORT;

const uri = `mongodb://${user}:${pass}@${host}:${port}/${db}?authSource=admin`;

mongoose.connect(uri)
    .then(() => console.log("Conectado a MongoDB: OK"))
    .catch(err => console.error("Error conectando a MongoDB: ", err));

module.exports = mongoose;
