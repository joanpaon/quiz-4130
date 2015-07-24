// Importa e instancia express
var express = require('express');

// Importa el módulo "path" de "node.js" 
var path = require('path');

// Importa MW auxiliar - Instalación previa
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');

// Importa el MW de enrutado - routes/index.js
var enrutador = require('./routes/index');

// ---

// Instancia la aplicación
var app = express();

// ---

// Configuración del motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Instalación del MW auxiliar
app.use(favicon(path.join(__dirname, 'public/img', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

// https://github.com/expressjs/body-parser#bodyparserurlencodedoptions
// ---
// The extended option allows to choose between parsing the 
// URL-encoded data with the querystring library (when false) or 
// the qs library (when true). 
// ---
// https://www.npmjs.com/package/qs#readme
app.use(bodyParser.urlencoded({
  extended: true // ---> /quizes/create
}));

// Lets you use HTTP verbs such as PUT or DELETE in places where 
// the client doesn't support it.
// https://github.com/expressjs/method-override
// ---
// NOTE It is very important that this module is used before any module 
// that needs to know the method of the request 
// (for example, it must be used prior to the csurf module).
// ---
// methodOverride(getter, options)
// Create a new middleware function to override the req.method property 
// with a new value. This value will be pulled from the provided getter.
// > getter - The getter to use to look up the overridden request 
//   method for the request. (default: X-HTTP-Method-Override)
// > options.methods - The allowed methods the original request must be 
//   in to check for a method override value. (default: ['POST'])
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());

// Instala un enrutador para la aplicación
// Se dispara a partir de "/" (Para cualquier ruta)
// Se podría haber escrito:
//   app.use(enrutador);
// Se ha mantenido la ruta para recalcar que es la ruta base
// de todos los enrutados interiores por si un dia se decidiese
// cambiar de ruta base 
// ---
// http://expressjs.com/es/4x/api.html#app.use
// app.use([path,] function [, function...])
// Mounts the middleware function(s) at the path. 
// If path is not specified, it defaults to “/”.
// ---
// Si alguna ruta es interceptada por el enrutador, la petición
// no pasa al siguiente MW
app.use('/', enrutador);

// --- Gestión de errores

// MW de gestión de recurso inexistente - 404
// Si "static" no dispone del recurso pedido y
// si el enrutador no reconoce la ruta introducida, se
// delega el control a este MW que lanza un error 404
app.use(function (req, res, next) {
  // Instancia un objeto de error
  var err = new Error('Recurso no disponible');

  // Establece el código de error
  err.status = 404;
  
  // Invoca el siguiente MW de error y le pasa el error
  next(err);
});

// MW de error
app.use(function (err, req, res, next) {
  // Establece el código de retorno
  res.status(err.status || 500);

  // Vista - Sin "/" inicial - Sin extensión "ejs"
  var _vista = "error";

  // Manejador de error - Desarrollo
  var _errorDesarrollo = {};
  if (app.get('env') === 'development') {
    _errorDesarrollo = err;
  }

  // Parámetros vista
  var _param = {
    message: err.message, // Mensaje de error
    error: _errorDesarrollo, // Error de enrutado
    errores: [] // Errores de validación
  };

  res.render(_vista, _param);
});

// Exporta el módulo
module.exports = app;