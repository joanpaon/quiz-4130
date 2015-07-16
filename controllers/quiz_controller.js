// Importa el modelo
var models = require("../models/models");

// GET - /quizes/question
var mwQuestion = function (req, res) {
  // Promesa de búsqueda
  var _prmQuestion = function (listaQuizes) {
    // Archivo ejs - Sin "/" inicial
    var __vista = "quizes/question";

    // Pregunta del primer Quiz
    var __param = {
      pregunta: listaQuizes[0].pregunta
    };

    // Renderizar la vista
    res.render(__vista, __param);
  };

  // findAll([options]) -> Promise.<Array.<Instance>>
  // Recupera el primer Quiz
  models.Quiz.findAll().then(_prmQuestion);
};

// GET - /quizes/answer
var mwAnswer = function (req, res) {
  // Promesa de búsqueda
  var _prmAnswer = function (listaQuizes) {
    // Archivo ejs - Sin "/" inicial
    var __vista = "quizes/answer";

    // Parámetros vista
    var __paramOK = {
      respuesta: 'Correcto'
    };
    var __paramNO = {
      respuesta: 'Incorrecto'
    };

    // Renderizar la vista
    if (req.query.respuesta.toUpperCase() === "ROMA") {
      res.render(__vista, __paramOK);
    } else {
      res.render(__vista, __paramNO);
    }
  };

  // Recupera el primer Quiz
  models.Quiz.findAll().then(_prmAnswer);
};

// Exporta controladores
exports.question = mwQuestion;
exports.answer = mwAnswer;