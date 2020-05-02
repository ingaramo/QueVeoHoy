//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var controlador = require('../servidor/controladores/controlador.js')

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});
app.get('/peliculas',controlador.getAllPeliculas);
app.get('/generos',controlador.getAllGeneros);
app.get('/peliculas/recomendacion', controlador.getRecomendacion);
app.get('/peliculas/:id',controlador.getPelicula);