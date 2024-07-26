const mongoose = require("mongoose");
const MONGODB_URL = "mongodb://127.0.0.1:27017/Nutrie";


const databaseConnect = () => {
    mongoose
      .connect(MONGODB_URL)
      .then(() => console.log(`Connected to DB`) )
      .catch((err) => console.log(err.message) );
}


module.exports = databaseConnect;
    
    