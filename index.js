const express = require('express');
const cheerio = require('cheerio');
const Handlebars = require('handlebars');
const axios = require('axios');
const Equipo = require('./model.js');
const app = require('./app.js');


///////////////////////////

const URL = 'https://www.futbolargentino.com/primera-division/tabla-de-posiciones';

let interval = 30; // expresar en minutos 

//////levantoel servidor con express //////////////////////////////////
app
/////////////////////////////////////////////////////////////////////


async function obtenerInfoTabla(){
  try {
    
    const response = await axios.get(URL)
    const $ = cheerio.load(response.data);
    const equipos = [];
    let tableRows = $('tbody > tr');

    tableRows.each(function(){
      let cols = $(this).find('td')

      const equipo = {
        
        //recorro cada columna y saco los espacios en blanco (me guardo lo que me sirve)
        
        pos : parseInt($(cols[0]).text().trim()),
        nombre: $(cols[1]).find('span').first().text().trim(), // me tomaba los dos <span> y me repetia el nombre
        partidosJ: $(cols[2]).text().trim(),
        ganados: parseInt($(cols[3]).text().trim()),
        empatados: parseInt($(cols[4]).text().trim()),
        perdidos: parseInt($(cols[5]).text().trim()),
        golesF: parseInt($(cols[6]).text().trim()),
        golesC: parseInt($(cols[7]).text().trim()),
        diferenciaG: parseInt($(cols[8]).text().trim()),
        puntos: parseInt($(cols[9]).text().trim()),
        img : $(this).find('img').attr('data-src')
        
      };
      if (equipo.pos <= 4) equipo.first = true; //
      if (equipo.pos >= 25) equipo.last = true; // para handlerbar con cariño =)
      equipos.push(equipo);
      
    });
    return equipos;    
    
  }
  catch(error) {
    console.error(error);
  };

}

// voy a vaciar la base de datos antes de actualizar... hago esto porque son muy pocos datos
//sino me fijaria si hay cambios primero y los actualizaria

async function vaciarBaseDeDatos() {
  try {
    await Equipo.collection.drop();
    console.log('Colección de equipos eliminada correctamente');
  } catch (error) {
    console.error(error);
  }
}

async function guardarEquipos() {
  //await vaciarBaseDeDatos()
  const equipos = await obtenerInfoTabla();
  //console.log(equipos);
  try {
    const resultado = await Equipo.insertMany(equipos);
    console.log('Equipos insertados correctamente:');
  } catch (error) {
    console.error(error);
  }
}



guardarEquipos();

/////iNSERT DE PRUBA FUNCIONANDO ////////////////////////////////////////
setInterval(async () => {
  console.log('Estoy en el interval - SE ACTUALIZÓ LA BASE DE DATOS');
  try {
    const datos = await obtenerInfoTabla();
    await vaciarBaseDeDatos()
    await guardarEquipos();
    console.log('La base de datos ha sido actualizada exitosamente');
  } catch (error) {
    console.error('Error al actualizar la base de datos:', error);
  }
}, interval * 60 * 1000); // tiene que recibir el interval en minutos


