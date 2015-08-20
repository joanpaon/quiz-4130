// Establece una lista de usuarios registrados
var usersList = {
  admin: {
    id: 1,
    username: "admin",
    password: "1234"
  },
  pepe: {
    id: 2,
    username: "pepe",
    password: "5678"
  }
};

// Comprueba si el usuario está en la lista
// ---
// Si la autenticación falla o hay errores se lanza el
// callback de gestión de error
var mwAutenticar = function (username, password, handlerAutenticar) {
  // Comprueba la existencia del usuario
  if (usersList[username]) {
    if (password === usersList[username].password) {
      // Crea la sesión con el usuario actual
      handlerAutenticar(null, usersList[username]);
    } else {
      // Error de password
      handlerAutenticar(new Error("Password erróneo"));
    }
  } else {
    // Error de usuario
    handlerAutenticar(new Error("No existe el usuario"));
  }
};

// Exporta controladores
exports.autenticar = mwAutenticar;