const mongoose = require("mongoose")
require("dotenv").config();


const dbConnection = async()=> {

    try {
       await mongoose.connect(Mongo_DB_URL)
       console.log("conectado");
    } catch (error) {
        console.log(error)
        throw new Error("Error")
    }


}


module.exports = {
    dbConnection,
}