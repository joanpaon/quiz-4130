// Gestor de modelos
//  > Define un ORM para la BD actual
//  > Importa el modelo de cada tabla
//  > Define las relaciones entre tablas
//  > Creación de las tablas y sus relaciones en la BD
//  > Exporta los modelos de las tablas

/**
 * http://www.redotheweb.com/2013/02/20/sequelize-the-javascript-orm-in-practice.html
 */

// Importa el módulo auxiliar
var util = require("./util");

// Instancia el ORM y lo conecta a la DB
var sequelize = util.inicializarORM();

/**
 * El modelo de una tabla definido en un fichero
 * Javascript aparte, se importa con el método:
 *   sequelize.import
 * al que se le pasa la ruta del fichero.
 * ---
 * El modelo queda referenciado en el ORM
 * ---
 * Devuelve una instancia del Modelo
 * ---
 * import(path) -> Model
 * ---
 * Imports a model defined in another file
 * ---
 * Imported models are cached, so multiple calls to import 
 * with the same path will not load the file multiple times
 */

// Importa modelos - Sin extensión ".js" - Misma carpeta
// sequelize.import envia como parámetros:
//  > sequelize - Referencia a la instancia actual del ORM
//  > DataTypes - Referencia de los tipos de datos soportados
var Quiz    = sequelize.import("quiz");    // Tabla "quiz"
var Comment = sequelize.import("comment"); // Tabla "comment"

// Define la relación entre las tablas "quiz" y "comment"
// http://docs.sequelizejs.com/en/latest/docs/associations/
// Method belongsTo adds a quizId attribute to Comment to hold the primary key value for Quiz
Comment.belongsTo(Quiz);  // Quiz    --> Parte 1
Quiz.hasMany(Comment);    // Comment --> Parte N - Referencia al Quiz al que pertenece

// Sincroniza DB y Modelo
util.sincronizarBD(sequelize, Quiz);

// Exporta modelos
exports.Quiz    = Quiz;    // Tabla "quiz"
exports.Comment = Comment; // Tabla "comment"