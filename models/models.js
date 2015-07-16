/**
 * http://www.redotheweb.com/2013/02/20/sequelize-the-javascript-orm-in-practice.html
 */

// Resuelve dependencias
var util = require("./util");

// --- Instanciación del ORM

// Instancia el ORM y lo conecta a la DB
var sequelize = util.inicializarORM();

// --- Importa modelos

/**
 * El modelo de una tabla definido en un fichero
 * Javascript aparte, se importa con el método:
 *   sequelize.import
 * al que se le pasa la ruta del fichero.
 * ---
 * El modelo queda referenciado en el ORM
 * ---
 * Devuelve una instancia del Modelo
 */

var Quiz = sequelize.import("quiz"); // Tabla "quiz"

// --- Sincroniza DB y Modelo
util.sincronizarBD(sequelize, Quiz);

// --- Exporta modelos

exports.Quiz = Quiz; // Tabla "quiz"