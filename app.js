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
var session = require('express-session');

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

// https://github.com/expressjs/session
// app.use(session());
// ---
// To store or access session data, simply use the request 
// property req.session, which is (generally) serialized as 
// JSON by the store, so nested objects are typically fine.
app.use(session({
  secret: 'Quiz-4130',
  cookie: {
    maxAge: 60000
  },
  resave: true,
  saveUninitialized: true
}));

// Aplicar "semilla" para cifrar los cookies
// Deberia ser un valor aleatorio
// ---
// Note Since express-session version 1.5.0, the cookie-parser
// middleware no longer needs to be used for this module to work.
// This module now directly reads and writes cookies on req/res. 
// Using cookie-parser may result in issues if the secret is not 
// the same between this module and cookie-parser.
// app.use(cookieParser("Quiz-4130"));

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

// Maquetación con EJS
// https://github.com/publicclass/express-partials
app.use(partials());

// Helpers dinámicos
app.use(function (req, res, next) {
  // Comprueba si en la URL de la petición existe
  // bien "/login" o bien "/logout"
  // ---
  // La variable req.path de NodeJS proporciona la URL de la
  // petición excluyendo los parámetros que hubiese.
  // A partir de ---> /myurl.htm?allkinds&ofparameters=true
  // Proporciona ---> /myurl.htm
  // http://expressjs.com/api.html#req.path
  if (!req.path.match(/\/login|\/logout/)) {
    // La variable req.session ha sido creada por express-ssesion
    // para el mantenimiento de la sessión
    // ---
    // En caso de una petición distinta a LOGIN/LOGOUT, se memoriza el 
    // PATH de la página en la que está el cliente en la variable 
    // req.session.redir para volver a ella después de hacer LOGIN/LOGOUT
    req.session.redir = req.path;
  }

  // Hacer visible los parámetros de la sesión en las vistas que se
  // manejan en el siguiente MW. 
  // ---
  // The app.locals object is a JavaScript object, and its properties 
  // are local variables within the application.
  // ---
  // The res.locals object contains response local variables scoped to 
  // the request, and therefore available only to the view(s) rendered 
  // during that request / response cycle (if any). 
  // Otherwise, this property is identical to app.locals.
  // ---
  // La variable req.session ha sido creada por express-ssesion
  // para el mantenimiento de la sessión
  res.locals.session = req.session;

  // Siguiente MW
  next();
});

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