const {Router} = require("express");
const {authenticate} = require("./middlewares/auth")
const errorController = require("./controllers/errorController")
const authRouter = require("./routes/auth")
const userRouter = require("./routes/users")
const subgreddiitsRouter = require("./routes/subgreddiits")
const postsRouter = require("./routes/posts")
const reportsRouter = require("./routes/reports")
const commentsRouter = require("./routes/comments")

const routes = Router();
routes.use(authRouter)
routes.use("/users", authenticate, userRouter)
routes.use("/subgreddiits", authenticate, subgreddiitsRouter)
routes.use("/posts", authenticate, postsRouter)
routes.use("/reports", authenticate, reportsRouter)
routes.use("/comments", authenticate, commentsRouter)

routes.get("/hello", (request, response) => {
  return response.json({message: "Hello World"})
})

routes.use(errorController)

module.exports = routes;
