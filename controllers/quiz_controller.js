// Importa el modelo
var models = require("../models/models");

// Autoload
// ---
// Si la ruta incluye :quizId lo carga y pasa el control
// al MW que corresponda
// ---
// Si la ruta no incluye :quizId o acontece cualquier
// error en la búsqueda entonces se lanza un error y
// se pasa el control al siguiente MW de error
var mwLoad = function (req, res, next, quizId) {
  // Manejador de findById
  var _handlerFindById = function (quiz) {
    // Comprueba si existe Quiz
    if (quiz) {
      // Almacena el quiz en request
      req.quiz = quiz;

      // Pasa el control al MW que corresponda
      next();
    } else {
      // Genera un objeto de error
      var _error = new Error("No existe el Quiz: " + quizId);

      // Pasa el control al MW de error
      next(_error);
    }
  };

  // Gestor de errores
  var _catcher = function (error) {
    // Pasa el control al MW de error
    next(error);
  };

  // findById([options], ') -> Promise.<Instance>
  // Recupera el Quiz identificado por su clave primaria
  models.Quiz.findById(quizId).then(_handlerFindById).catch(_catcher);
};

// GET - /quizes - index
var mwIndex = function (req, res, next) {
  // Manejador de búsqueda
  var _handlerFindAll = function (quizes) {
    // Vista - Sin "/" inicial - Sin extensión "ejs"
    var _vista = "quizes/index";

    // Parámetros vista
    var _param = {
      quizes: quizes,
      errores: []   // Errores de validación
    };

    // Renderizar la vista
    res.render(_vista, _param);
  };

  // Gestor de errores
  var _catcher = function (error) {
    // Pasa el control al MW de error
    next(error);
  };

  // findAll([options]) -> Promise.<Array.<Instance>>
  // Recupera todos los Quizes
  models.Quiz.findAll().then(_handlerFindAll).catch(_catcher);
};

// GET - /quizes/:quizId(\\d+) - show
var mwShow = function (req, res) {
  // Vista - Sin "/" inicial - Sin extensión "ejs"
  var _vista = "quizes/show";

  // Parámetros vista
  var _param = {
    quiz: req.quiz,
    errores: []   // Errores de validación
  };

  // Renderizar la vista
  res.render(_vista, _param);
};

// GET - /quizes/:quizId(\\d+)/answer - answer
var mwAnswer = function (req, res) {
  // Resultado del análisis
  var _resultado;

  // Determina el resultado
  if (req.query.respuesta.toUpperCase() === req.quiz.respuesta.toUpperCase()) {
    _resultado = "Correcto";
  } else {
    _resultado = "Incorrecto";
  }

  // Vista - Sin "/" inicial - Sin extensión "ejs"
  var _vista = "quizes/answer";

  // Parámetros vista
  var _param = {
    quiz: req.quiz,
    respuesta: _resultado,
    errores: []   // Errores de validación
  };

  // Renderizar la vista
  res.render(_vista, _param);
};

// GET - /quizes/new - Formulario para nuevo Quiz
var mwNew = function (req, res) {
  // Vista - Sin "/" inicial - Sin extensión "ejs"
  var _vista = "quizes/new";

  // Inicializa los campos de Quiz
  var _campos = {
    pregunta: "",
    respuesta: ""
  };
  
  // Instancia un objeto que representa una fila
  // de la tabla Quiz, inicializando los campos
  // pregunta y respuesta
  // ---
  // La utilidad de hacerlo así en ver de utilizar
  // variables discretas viene en el momento de la
  // validación, cuando hay un error, se pasan los
  // valores previos
  // ---
  // build(values, [options]) -> Instance
  // ---
  // Builds a new model instance. 
  // Values is an object of key value pairs, 
  // must be defined but can be empty.
  var _quiz = models.Quiz.build(_campos);
  
  // Parámetros vista
  var _param = {
    quiz: _quiz,
    errores: []   // Errores de validación
  };

  // Renderizar la vista
  res.render(_vista, _param);
};

// POST - /quizes/create - Crea un nuevo Quiz
var mwCreate = function (req, res) {
  // Recupera el objeto Quiz cuyos datos se introdujeron
  // en el formulario de creación de nuevo Quiz en los
  // campos con nombres "quiz.pregunta" y "quiz.respuesta"
  // ---
  // Como el formulario envia los datos con POST, éstos
  // se encuentran URL-encoded en el cuerpo de la petición
  // ---
  // Mediante el método "inflate" del "URL-unencoded" del
  // módulo "body-parser" esos nombres de campos generan
  // un objeto Quiz:
  //  {
  //    quiz: {
  //      pregunta: "Valor pregunta",
  //      respuesta: "Valor respuesta"
  //    }
  //  }
  // Este objeto es accesible a través de "req.body.quiz"
  var _quiz = models.Quiz.build(req.body.quiz);
  
  // Manejador de validacion
  var _handlerValidate = function (error) {
    // Comprueba si se ha producido un error de validación
    if (error) {
      // Vista - Sin "/" inicial - Sin extensión "ejs"
      var _vista = "quizes/new";

      // Parámetros vista
      var _param = {
        quiz: _quiz,
        errores: error.errors   // Errores de validación
      };

      // Renderiza de nuevo el formulario
      // Muestra valores previos y errores de validación
      res.render(_vista, _param);
    } else {
      // Manejador de salvaguarda
      var _handlerSave = function () {
        // Pedir la lista de quizes
        var _url = "/quizes";

        // Redirecciona la vista
        res.redirect(_url);
      };

      // Define los campos que se guardarán del Quiz
      var _campos = {
        fields: ["pregunta", "respuesta"]
      };
  
      // Guarda el quiz en BD y lista los Quizes actualizados
      _quiz.save(_campos).then(_handlerSave);
    }
  };
  
  // Valida el Quiz actual
  // https://github.com/chriso/validator.js
  _quiz.validate().then(_handlerValidate);
};

// GET - /quizes/:quizId(\\d+)/edit - Formulario para modificar Quiz
var mwEdit = function (req, res) {
  // Vista - Sin "/" inicial - Sin extensión "ejs"
  var _vista = "quizes/edit";

  // Recupera el Quiz a modificar - Autoload
  var _quiz = req.quiz;
  
  // Parámetros vista
  var _param = {
    quiz: _quiz,
    errores: []   // Errores de validación
  };

  // Renderizar la vista
  res.render(_vista, _param);
};

// PUT - /quizes/:quizId(\\d+) - Modifica Quiz
var mwUpdate = function (req, res) {
  // Recupera el Quiz autocargado de la BD
  var _quiz = req.quiz;
  
  // Recupera el Quiz enviado desde el formulario
  var _quizFRM = req.body.quiz;

  // Actualiza el valor de los campos
  _quiz.pregunta = _quizFRM.pregunta;
  _quiz.respuesta = _quizFRM.respuesta;
  
  // Manejador de validacion
  var _handlerValidate = function (error) {
    // Comprueba si se ha producido un error de validación
    if (error) {
      // Vista - Sin "/" inicial - Sin extensión "ejs"
      var _vista = "quizes/edit";

      // Parámetros vista
      var _param = {
        quiz: _quiz,
        errores: error.errors   // Errores de validación
      };

      // Renderiza de nuevo el formulario
      // Muestra valores previos y errores de validación
      res.render(_vista, _param);
    } else {
      // Manejador de salvaguarda
      var _handlerSave = function () {
        // Pedir la lista de quizes
        var _url = "/quizes";

        // Redirecciona la vista
        res.redirect(_url);
      };

      // Define los campos que se guardarán del Quiz
      var _campos = {
        fields: ["pregunta", "respuesta"]
      };
  
      // Guarda el quiz en BD y lista los Quizes actualizados
      _quiz.save(_campos).then(_handlerSave);
    }
  };
  
  // Valida el Quiz actual
  // https://github.com/chriso/validator.js
  _quiz.validate().then(_handlerValidate);
};

// Exporta controladores
exports.load   = mwLoad;
exports.index  = mwIndex;
exports.show   = mwShow;
exports.answer = mwAnswer;
exports.new    = mwNew;
exports.create = mwCreate;
exports.edit   = mwEdit;
exports.update = mwUpdate;