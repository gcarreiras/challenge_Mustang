const mongoose = require('mongoose');
const { Schema, model} = require("mongoose")


const equipoSchema = Schema({
  pos: Number,
  nombre: { type: String, required: true, unique: true },
  partidosJ: Number,
  ganados: Number,
  empatados: Number,
  perdidos: Number,
  golesF: Number,
  golesC: Number,
  diferenciaG: Number,
  puntos: Number,
  img: String, 
  first: {type: Boolean, default: false},
  last: {type: Boolean, default: false},
});



module.exports = model("Equipo", equipoSchema)