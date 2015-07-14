// MW de respuesta - Home Page
var mw = function (req, res) {
  // Página vista
  var _vista = "index";

  // Parámetros vista
  var _param = {
    title: 'Quiz'
  };

  // Renderizar la vista
  res.render(_vista, _param);
};

// Exporta controlador
exports.home = mw;