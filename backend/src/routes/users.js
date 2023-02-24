const {Router, request} = require("express");
const {
  findUser,
  updateUser,
  followUser,
  unfollowUser,
  getSavedPostsIDs,
  addSavedPost, removeSavedPost
} = require("../controllers/userController")
const {findSubgreddiit} = require("../controllers/subgreddiitController");
const {censor, findPostID} = require("../controllers/postController");
const fs = require("fs");
const multer = require('multer');
const path = require('path');
const usersRouter = Router()

const userProfilePicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./media/userProfilePics/")
  },
  filename: function (req, file, cb) {
    cb(null, `${req.username}${path.extname(file.originalname)}`)
  }
})

const upload = multer({storage: userProfilePicStorage})


usersRouter.post("/profilePic", upload.single("image"), async (request, response) => {
  if (!request.file || !request.file.mimetype.startsWith("image/"))
    return response.sendStatus(400)

  response.sendStatus(200)
})

usersRouter.get("/:username", async (request, response) => {
  const user = await findUser({username: request.params.username})
  if (user === null)
    return response.sendStatus(404)

  response.send(user)
})


usersRouter.get("/:username/savedPosts", async (request, response) => {
  if (request.params.username !== request.username)
    return response.sendStatus(401)
  const savedPosts = await getSavedPostsIDs(request.username);
  return response.send(savedPosts)
})

usersRouter.post("/:username/savedPosts", async (request, response) => {
  if (request.params.username !== request.username)
    return response.sendStatus(401)
  if (request.body.postID === undefined)
    return response.sendStatus(400)
  let post, subgreddiit;
  if (request.body.subgreddiitTitle === undefined) {
    post = await findPostID(request.body.postID)
    subgreddiit = await findSubgreddiit({_id: post.postedIn.title})
  } else {
    [post, subgreddiit] = await Promise.all([
      findPostID(request.body.postID),
      findSubgreddiit({title: request.body.subgreddiitTitle})
    ])
    if (post.postedIn.title !== subgreddiit.title)
      return response.sendStatus(404)
  }

  if (!subgreddiit.followers.filter((follower) => (follower.username === request.username)).length)
    return response.sendStatus(401)

  await addSavedPost(request.username, post)
  return response.sendStatus(200)
})

usersRouter.delete("/:username/savedPosts", async (request, response) => {
  if (request.params.username !== request.username)
    return response.sendStatus(401)
  if (request.body.postID === undefined)
    return response.sendStatus(400)
  await removeSavedPost(request.username, request.body.postID)
  return response.sendStatus(200)
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