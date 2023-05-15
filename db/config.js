const mongoose = require("mongoose")

if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}


const dbConnection = async()=> {

    try {
       await mongoose.connect(MONGODB_URI) // me estaria dando problemas en el deplpo
       console.log("conectado");
    } catch (error) {
        console.log(error)
        throw new Error("Error")
    }


}


module.exports = {
    dbConnection,
}