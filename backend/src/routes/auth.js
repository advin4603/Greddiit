const {Router} = require("express");
const {findUser, createNewUser} = require("../controllers/userController");
const {validatePassword} = require("../util/validate")
const {
  createHashedPassword,
  createAuthUser,
  generateJWT,
  findUserAuth,
  comparePassword
} = require("../controllers/authController")

const authRouter = Router()


authRouter.post("/users", async (request, response, next) => {
  try {
    if (!request.body.username)
      return response.status(400).send({errors: ["Username is required"], fields: ["username"]})

    if (!request.body.email)
      return response.status(400).send({errors: ["Email is required"], fields: ["email"]})

    const userWithUsername = await findUser({username: request.body.username});
    if (userWithUsername !== null)
      return response.status(403).send({errors: ["Username has already been taken"], fields: ["username"]})

    const userWithEmail = await findUser({email: request.body.email})
    if (userWithEmail !== null)
      return response.status(403).send({errors: ["Email has already been used in an account"], fields: ["email"]})

    const [code, passwordError] = validatePassword(request.body)
    if (code !== 200)
      return response.status(code).send({errors: [passwordError], fields: ["password", "confirmPassword"]})

    const newUser = await createNewUser(request.body)
    const hash = await createHashedPassword({password: request.body.password})
    await createAuthUser(newUser._id, hash)
    return response.send(generateJWT({username: newUser.username}))
  } catch (e) {
    next(e)
  }
})

authRouter.post("/signin", async (request, response, next) => {
    try {
      if (!request.body.username) {
        response.status(400).send({errors: ["Username is required"], fields: ["username"]})
        return
      }
      if (!request.body.password) {
        response.status(400).send({errors: ["Password is required"], fields: ["password"]})
        return
      }


      const userWithUsername = await findUser({username: request.body.username});
      if (userWithUsername === null) {
        response.status(401).send({errors: ["Wrong Username/Password"], fields: ["username", "password"]})
        return
      }

      const userAuth = await findUserAuth(userWithUsername._id)
      const match = await comparePassword(request.body.password, userAuth.hash)
      if (!match) {
        response.status(401).send({errors: ["Wrong Username/Password"], fields: ["username", "password"]})
        return
      }
      response.send(generateJWT({username: userWithUsername.username}))


    } catch
      (e) {
      next(e)
    }
  }
)

module.exports = authRouter;