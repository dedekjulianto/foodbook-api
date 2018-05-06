const app = require("./app");
const debug = require("debug")("server:server");
const http = require("http");

const port = normalizePort(process.env.PORT || "3030");

app.set("port", port);

http.createServer(app).listen(port, () => {
  console.log(`Foodbook API is listening on port ${port}`);
});

// http.createServer(app).on("error", onError);
// http.createServer(app).on("listening", onListening);

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

// function onError(error) {
//   if (error.syscall !== "listen") {
//     throw error
//   }
//
//   const bind = typeof port === "string" ? "Pipe " + port : "Port " + port
//
//   switch (error.code) {
//     case "EACCES":
//       console.error(bind + " require elevated privileges")
//       process.exit(1)
//       break
//     case "EADDRINUSE":
//       console.error(bind + " is already in use, try another port")
//       process.exit(1)
//       break
//     default:
//       throw error
//   }
// }
//
// function onListening() {
//   const addr = server.address();
//   const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
//   debug("Listening on " + bind);
// }
