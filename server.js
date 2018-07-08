var express  = require('express');
var app      = express();                     // Utilizamos express
var path = require('path');
var http = require('http');
var express = require('express');
var logger = require('morgan');

// Configuracion
app.use(express.static(path.join(__dirname, '/web')));
app.use(logger('dev'));            // activamos el log en modo 'dev'

// Cargamos los endpoints
  // require('./app/routes.js')(app);

// Cogemos el puerto para escuchar
if ('development' == app.get('env')) {
	console.log("Servidor DEV")
}

var server = http.createServer(app);
app.listen(8585, function () {
  console.log('Servidor arriba. Escuchando puerto 8585');
});
