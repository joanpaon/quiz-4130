// Importa e instancia express
var express = require('express');
var app = express();

// Importa el módulo "path" de "node.js" 
var path = require('path');

// Importa MW auxiliar - Instalación previa
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');

// Configuración del motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Instalación del MW auxiliar
app.use(favicon(path.join(__dirname, 'public/img', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());

// Enrutador de la aplicación
var routes = require('./routes/index');
app.use('/', routes);

// --- Gestión de errores

// Genera el error 404 y lanza el manejador de error
app.use(function(req, res, next) {
  var err = new Error('Recurso no disponible');
  err.status = 404;
  next(err);
});

// Manejador de error - Desarrollo
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Manejador de error - Producción
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// Exporta el módulo
module.exports = app;
