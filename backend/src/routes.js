const {Router} = require("express");
const {authenticate} = require("./middlewares/auth")
const errorController = require("./controllers/errorController")
const authRouter = require("./routes/auth")
const userRouter = require("./routes/users")
const subgreddiitsRouter = require("./routes/subgreddiits")
const postsRouter = require("./routes/posts")
const reportsRouter = require("./routes/reports")
const commentsRouter = require("./routes/comments")
const fs = require("fs");
const path = require('path');
const routes = Router();
routes.get("/users/:username/profilePic", async (request, response) => {
  if (!fs.existsSync("./media/userProfilePics/"))
    return response.redirect("/api/static/defaultUser.gif")

  const files = fs.readdirSync("./media/userProfilePics/")
  let matchingFile;
  const fileExists = files.some(file => {
    const nameWithoutExtension = path.parse(file).name;
    if( nameWithoutExtension === request.params.username){
      matchingFile = file
      return true
    }
  });

  if (fileExists)
    return response.redirect(`/api/static/userProfilePics/${matchingFile}`)
  else
    return response.redirect("/api/static/defaultUser.gif")

})
routes.get("/subgreddiits/:title/profilePic", async (request, response) => {
  if (!fs.existsSync(`./media/subgreddiitProfilePics/`))
    return response.redirect("/api/static/defaultSubgreddiit.gif")

  const files = fs.readdirSync("./media/subgreddiitProfilePics/")
  let matchingFile;
  const fileExists = files.some(file => {
    const nameWithoutExtension = path.parse(file).name;
    if( nameWithoutExtension === request.params.title){
      matchingFile = file
      return true
    }
  });

  if (fileExists)
    return response.redirect(`/api/static/subgreddiitProfilePics/${matchingFile}`)
  else
    return response.redirect("/api/static/defaultSubgreddiit.gif")
})
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
