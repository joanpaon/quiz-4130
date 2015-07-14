// Importa el módulo express
var express = require('express');

// Factoría de enrutadores
var router = express.Router();

// --- Controladores
var homeController = require("../controllers/home_controller.js")
var quizController = require("../controllers/quiz_controller.js")

// --- Secuencia de enrutado

router.get("/", homeController.home);   // Página principal

router.get("/quizes/question", quizController.question);   // Pregunta
router.get("/quizes/answer",   quizController.answer);     // Respuesta

// Exporta el enrutador
module.exports = router;