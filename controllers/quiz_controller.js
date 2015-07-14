// GET - /quizes/question
var mwQuestion = function (req, res) {
  // Archivo ejs - Sin "/" inicial
  var _vista = "quizes/question";

  // Parámetros vista
  var _param = {
    pregunta: 'Capital de Italia'
  };

  // Renderizar la vista
  res.render(_vista, _param);
};

// GET - /quizes/answer
var mwAnswer = function (req, res) {
  // Archivo ejs - Sin "/" inicial
  var _vista = "quizes/answer";

  // Parámetros vista
  var _paramOK = {
    respuesta: 'Correcto'
  };
  var _paramNO = {
    respuesta: 'Incorrecto'
  };

  // Renderizar la vista
  if (req.query.respuesta === "Roma") {
    res.render(_vista, _paramOK);
  } else {
    res.render(_vista, _paramNO);
  }
};

// Exporta controladores
exports.question = mwQuestion;
exports.answer   = mwAnswer;