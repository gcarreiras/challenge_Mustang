const express = require('express');
const hbs = require('hbs');
const cors = require("cors")
const Equipo = require('./model.js');
const { dbConnection } = require('./db/config.js');
const app = express();
let interval = 5; // expresar en minutos
const obtenerInfoTabla = require('./index.js')


app.use(cors())
app.set('view engine', 'hbs')
app.use(express.static('views', { "content-type": "text/css" }));

app.use(express.static(__dirname + '/public/css', {
  setHeaders: function(res, path, stat) {
    res.set('Content-Type', 'text/css');
  }
}));


app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/equipo.hbs');
});


// Iniciar el servidor
app.listen(3001, async() => {
  await dbConnection()
  console.log('Servidor iniciado en el puerto 3001');
});

app.get('/equipos', async (req, res) => {
  try {
    console.log('ahi va la info')
    
    const equipos = await Equipo.find();
  
    res.render("equipos",{ equipos: equipos });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los equipos');
  }
});

app.get('/equipos.css', function(req, res) {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(__dirname + '/public/equipos.css');
});


module.exports = app