// Importa el gestor de modelos
var models = require("../models/models");

// GET - /quizes/:quizId/comments/new - Formulario para nuevo comentario
var mwNew = function (req, res) {
  // Vista - Sin "/" inicial - Sin extensión "ejs"
  var _vista = "comments/new";

  // Parámetros vista
  var _param = {
    quizId: req.params.quizId,    // Memorizado por autoload
    errores: []                   // Errores de validación
  };

  // Renderizar la vista
  res.render(_vista, _param);
};

// POST - /quizes/:quizId/comments - Crear nuevo Comment
var mwCreate = function (req, res, next) {
  // Inicializa los campos de Quiz
  var _campos = {
    texto: req.body.comment.texto,    // Desde el body
    // El campo quizId se genera automáticamente uniendo el
    // Nombre de la tabla y el sufijo "Id"
    quizId: req.params.quizId         // Desde la ruta - quizId es clave ajena
  };

  // Instancia un objeto Comment para el comentario actual
  var _comment = models.Comment.build(_campos);

  // Manejador de validacion
  var _handlerValidate = function (error) {
    // Analisis de error de validación
    if (error) {
      // Vista - Sin "/" inicial - Sin extensión "ejs"
      var _vista = "comments/new";

      // Parámetros vista
      var _param = {
        comment: _comment,        // Comentario actual
        errores: error.errors     // Errores de validación
      };

      // Renderiza de nuevo el formulario para crear un
      // nuevo comentario mostrando los valores previos 
      // y los errores de validación de estos valores
      res.render(_vista, _param);
    } else {
      // Manejador de salvaguarda del comentario
      var _handlerSave = function () {
        // Ruta para mostrar el quiz actual junto con 
        // sus comentarios asociados
        var _ruta = "/quizes/" + req.params.quizId;

        // Redirecciona la vista
        res.redirect(_ruta);
      };

      // Guarda el comentario en BD y muestra el quiz actual
      _comment.save().then(_handlerSave);
    }
  };

  // Gestor de errores en la vista
  var _catcherValidate = function (error) {
    // Pasa el control al MW de error
    next(error);
  };

  // Valida el Quiz actual
  // https://github.com/chriso/validator.js
  _comment.validate().then(_handlerValidate).catch(_catcherValidate);
};

// Exporta controladores
exports.new    = mwNew;
exports.create = mwCreate;