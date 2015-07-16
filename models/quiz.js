/**
 * A Model represents a table in the database.
 * Sometimes you might also see it referred to as model, or simply as factory.
 * This class should not be instantiated directly,
 * it is created using sequelize.define,
 * and already created models can be loaded using sequelize.import
 */

/**
 * Short example of how to define your models in separate files
 * so that they can be imported by sequelize.import
 * http://code.runnable.com/UX6xnS4u-y5FAABb/using-multiple-model-files-with-sequelize-for-node-js
 */

/**
 * El modelo de una tabla se puede definir en un fichero 
 * Javascript aparte, que se importa con el método:
 *   sequelize.import
 * parametrizado con:
 *   > La ruta del fichero
 *   
 * Un modelo definido en un fichero independiente debe 
 * definirse como un módulo en forma de closure.
 * ---
 * La importación de un modelo invoca la closure asociada
 * que recibe dos parámetros:
 *   > sequelize - Referencia a la instancia del ORM de la BD
 *   > DataTypes - Clase auxiliar con los tipos de datos
 * ---
 * La closure debe devolver una instancia a la clase Model.
 */

// Definición de modelo de tabla
var crearModelo = function (sequelize, DataTypes) {
  // Nombre de tabla
  var _nombreTabla = "quiz";

  // Estructura de la tabla
  var _estructuraTabla = {
    pregunta: {
      type: DataTypes.STRING,
      field: "pregunta",
      allowNull: false,
      defaultValue: "pregunta"
    },
    respuesta: {
      type: DataTypes.STRING,
      field: 'respuesta',
      allowNull: false,
      defaultValue: "respuesta"
    }
  };

  // Configuración de la tabla
  var _configTabla = {};

  /**
   * Para definir un modelo hay que utilizar el método
   *   sequelize.define
   * parametrizado con:
   *   > Nombre de la tabla en la base de datos
   *   > Objeto que describe la estructura de la tabla
   *   > Objeto con los parámetros extra de configuración de la tabla
   * La definición devuelve el modelo como una instancia de la clase Model.
   */

  // Instancia el objeto que representa el modelo
  var Modelo = sequelize.define(_nombreTabla, _estructuraTabla, _configTabla);

  // Devuelve el modelo
  return Modelo
};

// Exporta el modelo
module.exports = crearModelo;