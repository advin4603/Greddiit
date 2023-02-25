const express = require("express");
const morgan = require("morgan")
const routes = require("./routes");
const cors = require("cors")

class App {
  server;

  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use("/api/static", express.static("media"))
    this.server.use(cors({origin: "*"}))
    this.server.use(express.json());
    this.server.use(morgan("tiny"))
  }

  routes() {
    this.server.use("/api", routes);
  }
}

module.exports = new App().server;
