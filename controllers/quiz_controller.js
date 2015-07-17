// Importa el modelo
var models = require("../models/models");

// GET - /quizes - index
var mwIndex = function (req, res) {
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

  // findAll([options]) -> Promise.<Array.<Instance>>
  // Recupera todos los Quizes
  models.Quiz.findAll().then(_promise);
};

// GET - /quizes/:quizId(\\d+) - show
var mwShow = function (req, res) {
  // Promesa
  var _promise = function (quiz) {
    // Vista - Sin "/" inicial - Sin extensión "ejs"
    var __vista = "quizes/show";

    // Parámetros vista
    var __param = {
      quiz: quiz
    };

    // Renderizar la vista
    res.render(__vista, __param);
  };

  // findById([options], ') -> Promise.<Instance>
  // Recupera el Quiz identificado por su clave primaria
  models.Quiz.findById(req.params.quizId).then(_promise);
};

// GET - /quizes/:quizId(\\d+)/answer - answer
var mwAnswer = function (req, res) {
  // Promesa
  var _promise = function (quiz) {
    // Vista - Sin "/" inicial - Sin extensión "ejs"
    var __vista = "quizes/answer";

    // Parámetros vista
    var __paramSI = {
      quiz: quiz,
      respuesta: "Correcto"
    };
    var __paramNO = {
      quiz: quiz,
      respuesta: "Incorrecto"
    };

    // Renderizar la vista
    if (req.query.respuesta.toUpperCase() === quiz.respuesta.toUpperCase()) {
      res.render(__vista, __paramSI);
    } else {
      res.render(__vista, __paramNO);
    }
  };

  // findById([options], ') -> Promise.<Instance>
  // Recupera el Quiz identificado por su clave primaria
  models.Quiz.findById(req.params.quizId).then(_promise);
};

// Exporta controladores
exports.index  = mwIndex;
exports.show   = mwShow;
exports.answer = mwAnswer;