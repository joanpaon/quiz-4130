// Importa sequelize - Crea el punto de entrada
var Sequelize = require('sequelize');

// La BD se configura ahora con las variables
//  > DATABASE_URL     - Local y Heroku
//  > DATABASE_STORAGE - Local
// En node.js ambas variables son propiedades de process.env
// ---
// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
// ---
// Se extraen sus componentes mediante RegExp que genera un array
// con los parámetros.
// Dependiendo la BD postgress|sqlite el valor de los parámetros se
// extrae de la URL de conexión o bien se inicializa a null

// Para probar en local
var DATABASE_URL     = "sqlite://:@:/";
var DATABASE_STORAGE = "quiz.sqlite";

//var url      = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var url = DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var dialect  = (url[1] || null);
var protocol = (url[1] || null);
var username = (url[2] || null);
var password = (url[3] || null);
var host     = (url[4] || null);
var port     = (url[5] || null);
var database = (url[6] || null);
//var storage = process.env.DATABASE_STORAGE;
var storage  = DATABASE_STORAGE;

// Configuración del ORM
var configORM = {
  dialect: dialect,
  protocol: protocol,
  host: host,
  port: port,
  storage: storage,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  define: {
    timestamps: true
  }
};

// Inicializa ORM
var inicializarORM = function () {
  // Instancia el ORM y lo conecta a la DB
  return new Sequelize(database, username, password, configORM);
};

// ---

// Sincronizar Modelo y DB
var sincronizarBD = function (sequelize, Quiz) {
  // Inicializa la BD
  var _inicializarBD = function () {
    // Muestra los datos pasados
    var _mostrarDatos = function (datos) {
      // Formato de visualización
      var _configLog = {
        plain: true
      };

      // Mostrar datos
//      console.log(datos);
      console.log("Inicialización de la base de datos terminada");
    };

    // Inserta datos de ejemplo
    var _insertarDatosEjemplo = function (numRegistros) {
      // Valor retorno
      var _retorno = [{}];

      // Inserta datos
      if (numRegistros === 0) {
        // Lista de registros de ejemplo
        var _listaQuizesEjemplo = [
          {
            pregunta: "Capital de Italia",
            respuesta: "Roma"
          },
          {
            pregunta: "Capital de Portugal",
            respuesta: "Lisboa"
          },
          {
            pregunta: "Capital de Francia",
            respuesta: "París"
          }
        ];

        // bulkCreate(records, [options]) -> Promise.<Array.<Instance>>
        // Inserta la fila actual
        _retorno = Quiz.bulkCreate(_listaQuizesEjemplo);
      }

      // Devuelve los datos insertados
      return _retorno;
    };

    // count([options]) -> Promise.<Integer>
    // Cuenta el número de registros
    Quiz.count()
      .then(_insertarDatosEjemplo)
      .then(_mostrarDatos);
  };

  // Informar sincronización terminada
  var _informarSincroOK = function () {
    console.log("Estructura de la base de datos sincronizada");
  };

  // Configuración de sincronización
  var _configSync = {
    force: false
  };

  // sync() -> Promise.<this>
  // Sincroniza MODELO y BD - Crea la tabla
  sequelize.sync(_configSync)
    .then(_informarSincroOK)
    .then(_inicializarBD);
};

// Exportar funcionalidades
module.exports.inicializarORM = inicializarORM;
module.exports.sincronizarBD  = sincronizarBD;