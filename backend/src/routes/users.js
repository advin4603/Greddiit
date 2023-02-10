const {Router} = require("express");
const {findUser, updateUser, followUser, unfollowUser} = require("../controllers/userController")

const usersRouter = Router()

usersRouter.get("/:username", async (request, response) => {
  const user = await findUser({username: request.params.username})
  if (user === null)
    return response.sendStatus(404)

  response.send(user)
})

usersRouter.patch("/:username", async (request, response, next) => {
  if (request.username !== request.params.username)
    return response.sendStatus(403)
  let update = {}
  if (request.body.firstName)
    update.firstName = request.body.firstName
  if (request.body.lastName)
    update.lastName = request.body.lastName
  if (request.body.email)
    update.email = request.body.email
  if (request.body.age)
    update.age = request.body.age
  if (request.body.contactNumber)
    update.contactNumber = request.body.contactNumber

  const userWithEmail = await findUser({email: request.body.email})
  if (userWithEmail !== null && userWithEmail.username !== request.username)
    return response.status(403).send({errors: ["Email has already been used in an account"], fields: ["email"]})


  try {
    await updateUser(request.username, update)
    return response.sendStatus(200)
  } catch (e) {
    next(e)
  }
})

usersRouter.post("/:username/follow", async (request, response, next) => {
  if (request.username === request.params.username)
    return response.sendStatus(405)
  const [toBeFollowed, follower] = await Promise.all([
    findUser({username: request.params.username}),
    findUser({username: request.username})
  ])
  if (toBeFollowed === null)
    return response.sendStatus(404)
  try {
    await followUser(follower, toBeFollowed)
  } catch (e) {
    next(e)
  }
  response.sendStatus(200)
})


usersRouter.post("/:username/unfollow", async (request, response, next) => {
  if (request.username === request.params.username)
    return response.sendStatus(405)
  const [toBeUnfollowed, unfollower] = await Promise.all([
    findUser({username: request.params.username}),
    findUser({username: request.username})
  ])
  if (toBeUnfollowed === null)
    return response.sendStatus(404)
  try {
    await unfollowUser(unfollower, toBeUnfollowed)
  } catch (e) {
    next(e)
  }
  response.sendStatus(200)
})


usersRouter.post("/:username/removeFollow", async (request, response, next) => {
  const [unfollower, toBeUnfollowed] = await Promise.all([
    findUser({username: request.params.username}),
    findUser({username: request.username})
  ])
  if (unfollower === null)
    return response.sendStatus(404)
  try {
    await unfollowUser(unfollower, toBeUnfollowed)
  } catch (e) {
    next(e)
  }
  response.sendStatus(200)
})

module.exports = usersRouter;