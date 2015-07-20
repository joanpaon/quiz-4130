// Importa el módulo express
var express = require('express');

// Factoría de enrutadores
var router = express.Router();

// --- Controladores
var homeController = require("../controllers/home_controller.js")
var quizController = require("../controllers/quiz_controller.js")

// --- Secuencia de enrutado

router.get("/", homeController.home);   // Página principal

router.param("quizId", quizController.load);  // Autoload de comandos con :quizId

router.get("/quizes",                      quizController.index);  // Listado Quizes
router.get("/quizes/:quizId(\\d+)",        quizController.show);   // Pregunta
router.get("/quizes/:quizId(\\d+)/answer", quizController.answer); // Respuesta

// Exporta el enrutador
module.exports = router;