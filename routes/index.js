// Importa el módulo express
var express = require('express');

// Factoría de enrutadores
var router = express.Router();

// --- Controladores
var homeController = require("../controllers/home_controller.js");
var quizController = require("../controllers/quiz_controller.js");

// --- Secuencia de enrutado

// Página principal - localhost:5000
router.get("/", homeController.home);   

// Autoload de Quiz para rutas con :quizId
router.param("quizId", quizController.load);  

// Rutas de Quiz
router.get("/quizes",                      quizController.index);   // Listado Quizes
router.get("/quizes/:quizId(\\d+)",        quizController.show);    // Pregunta
router.get("/quizes/:quizId(\\d+)/answer", quizController.answer);  // Respuesta
router.get("/quizes/new",                  quizController.new);     // Pedir formulario Nuevo Quiz
router.post("/quizes/create",              quizController.create);  // Crear nuevo Quiz
router.get("/quizes/:quizId(\\d+)/edit",   quizController.edit);    // Pedir formulario Modificar Quiz
router.put("/quizes/:quizId(\\d+)",        quizController.update);  // Actualizar Quiz
router.delete("/quizes/:quizId(\\d+)",     quizController.destroy); // Eliminar Quiz

// Exporta el enrutador
module.exports = router;