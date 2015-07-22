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
  // Promesa
  var _promise = function (quiz) {
    // Comprueba si existe Quiz
    if (quiz) {
      // Almacena el quiz en request
      req.quiz = quiz;

      // Pasa el control al MW que corresponda
      next();
    } else {
      // Genera un objeto de error
      var __error = new Error("No existe el Quiz: " + quizId);

      // Pasa el control al MW de error
      next(__error);
    }
  };

  // Gestor de errores
  var _catcher = function (error) {
    // Pasa el control al MW de error
    next(error);
  };

  // findById([options], ') -> Promise.<Instance>
  // Recupera el Quiz identificado por su clave primaria
  models.Quiz.findById(quizId).then(_promise).catch(_catcher);
};

// GET - /quizes - index
var mwIndex = function (req, res, next) {
  // Promesa
  var _promise = function (quizes) {
    // Vista - Sin "/" inicial - Sin extensión "ejs"
    var __vista = "quizes/index";

    // Parámetros vista
    var __param = {
      quizes: quizes
    };

    // Renderizar la vista
    res.render(__vista, __param);
  };

  // Gestor de errores
  var _catcher = function (error) {
    // Pasa el control al MW de error
    next(error);
  };

  // findAll([options]) -> Promise.<Array.<Instance>>
  // Recupera todos los Quizes
  models.Quiz.findAll().then(_promise).catch(_catcher);
};

// GET - /quizes/:quizId(\\d+) - show
var mwShow = function (req, res) {
  // Vista - Sin "/" inicial - Sin extensión "ejs"
  var _vista = "quizes/show";

  // Parámetros vista
  var _param = {
    quiz: req.quiz
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
  var __vista = "quizes/answer";

  // Parámetros vista
  var __param = {
    quiz: req.quiz,
    respuesta: _resultado
  };

  // Renderizar la vista
  res.render(__vista, __param);
};

// GET - /quizes/new - Formulario para nuevo Quiz
var mwNew = function (req, res) {
  // Vista - Sin "/" inicial - Sin extensión "ejs"
  var _vista = "quizes/new";

  // Define los campos de Quiz
  var _campos = {
    pregunta: "Escribir pregunta",
    respuesta: "Escribir respuesta"
  };
  
  // Instancia un objeto que representa una fila
  // de la tabla Quiz, inicializando los campos
  // pregunta y respuesta
  // ---
  // Realmente, en este caso, no es necesario hacer
  // esto. Bastaria con enviar "_campos"
  var _quiz = models.Quiz.build(_campos);
  
  // Parámetros vista
  var _param = {
    quiz: _quiz
  };

  // Renderizar la vista
  res.render(_vista, _param);
};

// POST - /quizes/create - Crea un nuevo Quiz
var mwCreate = function (req, res) {
  // Promesa
  var _promise = function () {
    // Pedir la lista de quizes
    var __url = "/quizes";

    // Redirecciona la vista
    res.redirect(__url);
  };

  // Define los campos que se guardarán del Quiz
  var _campos = {
    fields: ["pregunta", "respuesta"]
  };
  
  // Recupera el objeto Quiz cuyos datos se introdujeron
  // en el formulario de creación de nuevo Quiz en los
  // campos con nombres "quiz[pregunta]" y "quiz[respuesta]"
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
  
  // Guarda el quiz en BD y lista los Quizes actualizados
  _quiz.save(_campos).then(_promise);
};

// Exporta controladores
exports.load   = mwLoad;
exports.index  = mwIndex;
exports.show   = mwShow;
exports.answer = mwAnswer;
exports.new    = mwNew;
exports.create = mwCreate;