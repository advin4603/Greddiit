const {Router} = require("express")
const {
  findSubgreddiit,
  createNewSubgreddiit,
  getModeratedSubgreddiits,
  deleteSubgreddiit,
  addTag,
  addBannedKeyword,
  removeTag,
  removeBannedKeyword,
  updateSubgreddiit,
  requestSubgreddiitJoin,
  approveSubgreddiitJoin, rejectSubgreddiitJoin, createSubgreddiitOutsiderView, createSubgreddiitFollowerView,
  getJoinedSubgreddiits, getNotJoinedSubgreddiits, removeFollower, addVisitLog
} = require("../controllers/subgreddiitController")
const {findUser} = require("../controllers/userController")
const {getPostsInSubgreddiit} = require("../controllers/postController");
const {getReportsInSubgreddiit} = require("../controllers/reportController");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const subgreddiitsRouter = Router()

const subgreddiitProfilePicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const subgreddiitDir = "./media/subgreddiitProfilePics/"
    fs.mkdirSync(subgreddiitDir, {recursive: true})
    cb(null, subgreddiitDir)
  },
  filename: function (req, file, cb) {
    cb(null, `${req.params.title}${path.extname(file.originalname)}`)
  }
})

const upload = multer({storage: subgreddiitProfilePicStorage})

subgreddiitsRouter.post("/:title/profilePic", async (request, response, next) => {
  const subgreddiit = await findSubgreddiit({title: request.params.title})
  if (subgreddiit === null)
    return response.sendStatus(404)
  if (subgreddiit.moderator.username !== request.username)
    return response.sendStatus(401)

  request.subgreddiit = subgreddiit.title;
  next()
}, upload.single("image"), async (request, response) => {
  if (!request.file || !request.file.mimetype.startsWith("image/"))
    return response.sendStatus(400)

  response.sendStatus(200)
})

subgreddiitsRouter.get("/moderated", async (request, response) => {
  const user = await findUser({username: request.username});
  const subgreddiits = await getModeratedSubgreddiits(user);
  const posts = await Promise.all(subgreddiits.map((subgreddiit) => getPostsInSubgreddiit(subgreddiit)));
  for (let i = 0; i < posts.length; i++) {
    subgreddiits[i] = {...subgreddiits[i]._doc, postCount: posts[i].length}
  }
  return response.send(subgreddiits)
})

subgreddiitsRouter.get("/:title/reports", async (request, response) => {
  const subgreddiit = await findSubgreddiit({title: request.params.title})
  if (subgreddiit === null)
    return response.sendStatus(404)
  if (subgreddiit.moderator.username !== request.username)
    return response.sendStatus(401)
  const reports = await getReportsInSubgreddiit(subgreddiit)
  return response.send(reports)
})


subgreddiitsRouter.post("/:title/tags", async (request, response, next) => {
  const subgreddiit = await findSubgreddiit({title: request.params.title})
  if (subgreddiit === null)
    return response.sendStatus(404)
  if (subgreddiit.moderator.username !== request.username)
    return response.sendStatus(401)

  if (!request.body.tag)
    return response.status(400).send({errors: ["A tag is required"], fields: ["tag"]})

  try {
    await addTag(subgreddiit, request.body.tag)
    return response.sendStatus(200)
  } catch (e) {
    next(e)
  }
})

subgreddiitsRouter.delete("/:title/tags", async (request, response, next) => {
  const subgreddiit = await findSubgreddiit({title: request.params.title})
  if (subgreddiit === null)
    return response.sendStatus(404)
  if (subgreddiit.moderator.username !== request.username)
    return response.sendStatus(401)

  if (!request.body.tag)
    return response.status(400).send({errors: ["A tag is required"], fields: ["tag"]})

  try {
    await removeTag(subgreddiit, request.body.tag)
    return response.sendStatus(200)
  } catch (e) {
    next(e)
  }
})

subgreddiitsRouter.post("/:title/bannedKeywords", async (request, response, next) => {
  const subgreddiit = await findSubgreddiit({title: request.params.title})
  if (subgreddiit === null)
    return response.sendStatus(404)
  if (subgreddiit.moderator.username !== request.username)
    return response.sendStatus(401)

  if (!request.body.bannedKeyword)
    return response.status(400).send({errors: ["A bannedKeyword is required"], fields: ["bannedKeyword"]})

  try {
    await addBannedKeyword(subgreddiit, request.body.bannedKeyword.toLowerCase())
    return response.sendStatus(200)
  } catch (e) {
    next(e)
  }
})

subgreddiitsRouter.delete("/:title/bannedKeywords", async (request, response, next) => {
  const subgreddiit = await findSubgreddiit({title: request.params.title})
  if (subgreddiit === null)
    return response.sendStatus(404)
  if (subgreddiit.moderator.username !== request.username)
    return response.sendStatus(401)

  if (!request.body.bannedKeyword)
    return response.status(400).send({errors: ["A bannedKeyword is required"], fields: ["bannedKeyword"]})

  try {
    await removeBannedKeyword(subgreddiit, request.body.bannedKeyword.toLowerCase())
    return response.sendStatus(200)
  } catch (e) {
    next(e)
  }
})

subgreddiitsRouter.post("/:title/join", async (request, response) => {
  const [subgreddiit, user] = await Promise.all([findSubgreddiit({title: request.params.title}), findUser({username: request.username})])
  if (subgreddiit === null)
    return response.sendStatus(404)
  if (subgreddiit.followers.filter((follower) => (follower.username === request.username)).length)
    return response.sendStatus(405)
  if (subgreddiit.blockedUsers.filter((blockedUser) => (blockedUser.username === request.username)).length)
    return response.sendStatus(405)
  if (subgreddiit.rejectedUsers.filter(({
                                          rejectedUser,
                                          rejectionExpiry
                                        }) => (rejectedUser.username === request.username && new Date() < rejectionExpiry)).length)
    return response.sendStatus(405)
  if (subgreddiit.exFollowers.filter((follower) => (follower.username === request.username)).length)
    return response.sendStatus(405)
  await requestSubgreddiitJoin(subgreddiit, user)
  response.sendStatus(200)
})

subgreddiitsRouter.post("/:title/leave", async (request, response) => {
  const [subgreddiit, user] = await Promise.all([findSubgreddiit({title: request.params.title}), findUser({username: request.username})])
  if (subgreddiit === null)
    return response.sendStatus(404)
  if (subgreddiit.moderator.username === request.username)
    return response.sendStatus(405)

  if (!subgreddiit.followers.filter((follower) => (follower.username === request.username)).length)
    return response.sendStatus(405)
  await removeFollower(subgreddiit, user)
  return response.sendStatus(200)
})

subgreddiitsRouter.post("/:title/approveJoin", async (request, response) => {
  const [subgreddiit, user] = await Promise.all([findSubgreddiit({title: request.params.title}), findUser({username: request.body.username})])
  if (subgreddiit === null)
    return response.sendStatus(404)
  if (subgreddiit.moderator.username !== request.username)
    return response.sendStatus(401)
  if (!subgreddiit.followRequests.filter((follower) => (follower.username === user.username)).length)
    return response.sendStatus(405)

  await approveSubgreddiitJoin(subgreddiit, user)
  response.sendStatus(200)

})

subgreddiitsRouter.post("/:title/rejectJoin", async (request, response) => {
  const [subgreddiit, user] = await Promise.all([findSubgreddiit({title: request.params.title}), findUser({username: request.body.username})])
  if (subgreddiit === null)
    return response.sendStatus(404)
  if (subgreddiit.moderator.username !== request.username)
    return response.sendStatus(401)
  if (!subgreddiit.followRequests.filter((follower) => (follower.username === user.username)).length)
    return response.sendStatus(405)

  await rejectSubgreddiitJoin(subgreddiit, user)
  response.sendStatus(200)
})

subgreddiitsRouter.get("/:title", async (request, response) => {
  const subgreddiit = await findSubgreddiit({title: request.params.title})
  if (subgreddiit === null)
    return response.sendStatus(404)
  if (!subgreddiit.followers.filter((follower) => (follower.username === request.username)).length)
    return response.send(
      createSubgreddiitOutsiderView(subgreddiit, request.username)
    )
  if (subgreddiit.moderator.username !== request.username)
    return response.send(
      createSubgreddiitFollowerView(subgreddiit)
    )
  response.send(subgreddiit)
  await addVisitLog(subgreddiit)
})


subgreddiitsRouter.delete("/:title", async (request, response) => {
  const subgreddiit = await findSubgreddiit({title: request.params.title})
  if (subgreddiit === null)
    return response.sendStatus(404)
  const moderator = await findUser({_id: subgreddiit.moderator})
  if (moderator.username !== request.username)
    return response.sendStatus(403)

  await deleteSubgreddiit(subgreddiit)
  return response.sendStatus(200)
})

subgreddiitsRouter.patch("/:title", async (request, response, next) => {
  const subgreddiit = await findSubgreddiit({title: request.params.title})
  if (subgreddiit === null)
    return response.sendStatus(404)
  const moderator = await findUser({_id: subgreddiit.moderator})
  if (moderator.username !== request.username)
    return response.sendStatus(403)

  const update = {}
  if (request.body.title !== undefined)
    update.title = request.body.title

  if (request.body.description !== undefined)
    update.description = request.body.description

  try {
    await updateSubgreddiit(subgreddiit, update)
    return response.sendStatus(200)
  } catch (e) {
    next(e)
  }
})
subgreddiitsRouter.post("", async (request, response, next) => {
  try {
    if (!request.body.title)
      return response.status(400).send({errors: ["Title is required"], fields: ["title"]})

    if (!request.body.description)
      return response.status(400).send({errors: ["Description is required"], fields: ["description"]})

    const subgreddiitWithTitle = await findSubgreddiit({title: request.body.title})
    if (subgreddiitWithTitle !== null)
      return response.status(403).send({errors: ["Subgreddiit with that title already exists"], fields: ["title"]})

    const moderator = await findUser({username: request.username})
    await createNewSubgreddiit({
      title: request.body.title,
      description: request.body.description,
      moderator
    })
    return response.sendStatus(200)
  } catch (e) {
    next(e)
  }
})

subgreddiitsRouter.get("", async (request, response) => {
  const user = await findUser({username: request.username})
  let [joinedSubgreddiits, notJoinedSubgreddiits] = await Promise.all([
    getJoinedSubgreddiits(user),
    getNotJoinedSubgreddiits(user)
  ])
  joinedSubgreddiits = joinedSubgreddiits.map((subgreddiit) => (subgreddiit.moderator === request.username) ? subgreddiit : createSubgreddiitFollowerView(subgreddiit))
  notJoinedSubgreddiits = notJoinedSubgreddiits.map((subgreddiit) => createSubgreddiitOutsiderView(subgreddiit, request.username))

  let joinedSubgreddiitsPostsPromises = Promise.all(joinedSubgreddiits.map(subgreddiit => (getPostsInSubgreddiit(subgreddiit))))
  let notJoinedSubgreddiitsPostsPromises = Promise.all(notJoinedSubgreddiits.map(subgreddiit => (getPostsInSubgreddiit(subgreddiit))))

  let [joinedSubgreddiitsPosts, notJoinedSubgreddiitsPosts] = await Promise.all([joinedSubgreddiitsPostsPromises, notJoinedSubgreddiitsPostsPromises])

  joinedSubgreddiits = joinedSubgreddiits.map((subgreddiit, index) => {
    return (subgreddiit.moderator === request.username) ? {
      ...subgreddiit.data,
      postCount: joinedSubgreddiitsPosts[index].length
    } : {...subgreddiit, postCount: joinedSubgreddiitsPosts[index].length}
  })

  notJoinedSubgreddiits = notJoinedSubgreddiits.map((subgreddiit, index) => {
    return {
      ...subgreddiit, postCount: notJoinedSubgreddiitsPosts[index].length
    }
  })
  response.send({joinedSubgreddiits, notJoinedSubgreddiits})
})


module.exports = subgreddiitsRouter