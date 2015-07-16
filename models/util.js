// Inicializa ORM
var inicializarORM = function () {
  // Importa sequelize - Crea el punto de entrada
  var _Sequelize = require('sequelize');

  // Credenciales
  var _database = null;
  var _username = null;
  var _password = null;

  // Configuración del ORM
  var _configORM = {
    host: 'localhost',
    dialect: 'sqlite',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    storage: 'quiz.sqlite',
    define: {
      timestamps: true
    }
  };

  // Instancia el ORM y lo conecta a la DB
  return new _Sequelize(_database, _username, _password, _configORM);
};

// ---

// Sincronizar Modelo y DB
var sincronizarBD = function (sequelize, Quiz) {
  // Inicializa la BD
  var _inicializarBD = function () {
    // Muestra los datos pasados
    var __mostrarDatos = function (datos) {
      // Formato de visualización
      var ___configLog = {
        plain: true
      };

      // Mostrar datos
      //      console.log(datos);
      console.log(datos.get(___configLog));
      console.log("Inicialización de la base de datos terminada");
    };

    // Inserta datos de ejemplo
    var __insertarDatosEjemplo = function (numRegistros) {
      // Valor retorno
      var ___retorno = {};

      // Inserta datos
      if (numRegistros === 0) {
        // Registro de ejemplo
        var ___quizEjemplo = {
          pregunta: "Capital de Italia",
          respuesta: "Roma"
        };

        // Inserta la fila actual
        ___retorno = Quiz.create(___quizEjemplo);
      }

      // Devuelve los datos insertados
      return ___retorno;
    };

    // count([options]) -> Promise.<Integer>
    // Cuenta el número de registros
    Quiz.count()
      .then(__insertarDatosEjemplo)
      .then(__mostrarDatos);
  };

  // Informar sincronización terminada
  var _informarSincroOK = function () {
    console.log("Estructura de la base de datos sincronizada");
  };

  // Configuración de sincronización
  var _configSync = {
    force: true
  };

  // sync() -> Promise.<this>
  // Sincroniza MODELO y BD - Crea la tabla
  sequelize.sync(_configSync)
    .then(_informarSincroOK)
    .then(_inicializarBD);
};

// ---

module.exports.inicializarORM = inicializarORM;
module.exports.sincronizarBD = sincronizarBD;