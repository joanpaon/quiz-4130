// Importa el módulo express
var express = require('express');

// Importa los controladores - No es necesario indicar extensión JS
var homeController    = require("../controllers/home_controller");     // localhost:5000
var quizController    = require("../controllers/quiz_controller");     // Localhost:5000/quizes
var commentController = require("../controllers/comment_controller");  // Localhost:5000/quizes/:quizId(\\d+)/comments
var sessionController = require("../controllers/session_controller");  // Localhost:5000/login - Localhost:5000/logout

// Instancia el enrutador
// ---
// http://expressjs.com/es/4x/api.html#router
// A router object is an isolated instance of middleware and routes
// You can think of it as a “mini-application,” capable only of 
// performing middleware and routing functions. 
// Every Express application has a built-in app router.
// ---
// A router behaves like middleware itself, so you can use it as 
// an argument to app.use() or as the argument to another router’s 
// use() method.
// The top-level express object has a Router() function that 
// creates a new router object.
var enrutador = express.Router();

// Instala el controlador de la página principal - localhost:5000
enrutador.get("/", homeController.home);   

// Instala el controlador de Autoload de Quiz para rutas con :quizId
enrutador.param("quizId", quizController.load);  

// Instala los controladorres de las rutas de control de sesión
enrutador.get("/login",                       sessionController.new);     // Formulario LOGIN
enrutador.post("/login",                      sessionController.create);  // Crear sesión
enrutador.delete("/logout",                   sessionController.destroy); // Destruir sesión

// Instala los controladorres de las rutas de Quiz
enrutador.get("/quizes",                      quizController.index);   // Listado Quizes
enrutador.get("/quizes/:quizId(\\d+)",        quizController.show);    // Pregunta
enrutador.get("/quizes/:quizId(\\d+)/answer", quizController.answer);  // Respuesta

// Una ruta puede invocarse con varios MWs separados por comas
// que se ejecutan en serie, de forma que si el primer MW no 
// pasa el control al segundo MW con next, el segundo MW no
// llegará a ejecutarse
// ---
// Entre el MW principal y la ruta se interpone un MW de filtro
// que solo dejará pasar el control al MW principal con next
// si el usuario está autenticado
// ---
// El filtro sólo se aplica a aquellas operaciones de las que
// desee que solo pueda acceder un usuario autenticado.
enrutador.get("/quizes/new",                  sessionController.loginRequired, quizController.new);     // Pedir formulario muevo Quiz
enrutador.post("/quizes/create",              sessionController.loginRequired, quizController.create);  // Crear nuevo Quiz
enrutador.get("/quizes/:quizId(\\d+)/edit",   sessionController.loginRequired, quizController.edit);    // Pedir formulario modificar Quiz
enrutador.put("/quizes/:quizId(\\d+)",        sessionController.loginRequired, quizController.update);  // Actualizar Quiz
enrutador.delete("/quizes/:quizId(\\d+)",     sessionController.loginRequired, quizController.destroy); // Eliminar Quiz

// Instala los controladorres de las rutas de Comment
enrutador.get("/quizes/:quizId(\\d+)/comments/new", commentController.new);     // Pedir formulario nuevo Comment
enrutador.post("/quizes/:quizId(\\d+)/comments",    commentController.create);  // Crear nuevo Comment

// Exporta el enrutador
module.exports = enrutador;