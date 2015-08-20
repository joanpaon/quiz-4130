// GET - /login - Formulario LOGIN
var mwNew = function (req, res) {
  // Vista - Sin "/" inicial - Sin extensión "ejs"
  var _vista = "sessions/new";

  // Memoriza los errores de sesión, si existen
  // ---
  // Qué errores de validación almacenados en la sesión van 
  // haber al pedir el formulario de LOGIN para iniciar 
  // precisamente la sesión????
  var _errores = req.session.errores || {};

  // Resetea los errores de la sesión
  req.session.errores = {};

  // Parámetros vista
  var _param = {
    errores: _errores // Errores de validación
  };

  // Renderizar la vista
  res.render(_vista, _param);
};

// POST - /login - Crear la sesión
var mwCreate = function (req, res) {
  // Recupera los valores USERNAME y PASSWORD desde el BODY que
  // han sido introducidos y enviados por el usuario en un POST
  var _username = req.body.username;
  var _password = req.body.password;

  // Carga el módulo de control de usuarios - Está en la misma carpeta controllers
  var _userController = require("./user_controller");

  // Define un Callback para la autenticación de usuario
  var _handlerAutenticar = function (error, usuario) {
    // Comprobar error de autenticación 
    if (error) {
      // Se memoriza el error en la sesión
      req.session.errores = [{
        message: "Se ha producido un error: " + error
      }];

      // Repite la petición de LOGIN enviando el error
      res.redirect("/login");
    } else {
      // La existencia de una sesión se señaliza por la existencia 
      // de la variable req.session.user
      // ---
      // El parámetro user del callback proporciona
      // ---> id       - El identificador del la sesión
      // ---> username - El nombre de usuario
      req.session.user = {
        id: usuario.id,              // Clave primaria de usuario
        username: usuario.username   // Nombre de usuario
      };

      // Obtiene el PATH anterior al LOGIN - Convertido a String???
      var _pathPrevio = req.session.redir.toString();

      // Redirecciona al PATH anterior al LOGIN con el usuario memorizado
      res.redirect(_pathPrevio);
    }
  };

  // Autenticar usuario
  _userController.autenticar(_username, _password, _handlerAutenticar);
};

// DELETE - /logout - Destruir la sesión
var mwDestroy = function (req, res) {
  // Borra la variable que señaliza la existencia de una sesión
  delete req.session.user;

  // Obtiene el PATH anterior al LOGIN - Convertido a String???
  var _pathPrevio = req.session.redir.toString();

  // Redirecciona al PATH anterior al LOGIN
  res.redirect(_pathPrevio);
};

// Exporta controladores
exports.new     = mwNew;
exports.create  = mwCreate;
exports.destroy = mwDestroy;