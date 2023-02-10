const {Router} = require("express")
const {
  findSubgreddiit,
  createNewSubgreddiit,
  getModeratedSubgreddiits,
  deleteSubgreddiit
} = require("../controllers/subgreddiitController")
const {findUser} = require("../controllers/userController")
const {getPostsInSubgreddiit} = require("../controllers/postController");

const subgreddiitsRouter = Router()


subgreddiitsRouter.get("/moderated", async (request, response) => {
  const user = await findUser({username: request.username});
  const subgreddiits = await getModeratedSubgreddiits(user);
  const posts = await Promise.all(subgreddiits.map((subgreddiit) => getPostsInSubgreddiit(subgreddiit)));
  for (let i = 0; i < posts.length; i++) {
    subgreddiits[i] = {...subgreddiits[i]._doc, postCount: posts[i].length}
    console.log(subgreddiits[i])
  }
  return response.send(subgreddiits)
})


subgreddiitsRouter.get("/:title", async (request, response) => {
  const subgreddiit = await findSubgreddiit({title: request.params.title})
  if (subgreddiit === null)
    return response.sendStatus(404)
  if (!subgreddiit.followers.filter((follower) => (follower === request.username)))
    return response.sendStatus(401)
  response.send(subgreddiit)
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


module.exports = subgreddiitsRouter