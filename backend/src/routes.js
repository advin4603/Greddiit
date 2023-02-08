const {Router} = require("express");
const {authenticate} = require("./middlewares/auth")
const errorController = require("./controllers/errorController")
const authRouter = require("./routes/auth")
const userRouter = require("./routes/users")

const routes = Router();
routes.use(authRouter)
routes.use("/users", authenticate, userRouter)


routes.get("/", (request, response) => {
  return response.json({message: "Hello World"})
})

routes.use(errorController)


module.exports = routes;
