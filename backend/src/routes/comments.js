const {Router, request} = require("express")
const {findPostID} = require("../controllers/postController");
const {findUser} = require("../controllers/userController");
const {createNewComment, findCommentID, upvote, downvote, removeVote} = require("../controllers/commentController");
const {findSubgreddiit} = require("../controllers/subgreddiitController");

const commentsRouter = Router()

commentsRouter.post("/:id/upvote", async (request, response) => {
  const comment = await findCommentID(request.params.id)
  if (comment === null)
    return response.sendStatus(404)

  const [subgreddiit, user] = await Promise.all(
    [
      findSubgreddiit({_id: comment.commentedIn}),
      findUser({username: request.username})
    ]
  )
  if (!subgreddiit.followers.filter((follower) => (follower.username === request.username)).length)
    return response.sendStatus(401)

  await upvote(comment, user)
  response.sendStatus(200)
})

commentsRouter.post("/:id/downvote", async (request, response) => {
  const comment = await findCommentID(request.params.id)
  if (comment === null)
    return response.sendStatus(404)

  const [subgreddiit, user] = await Promise.all(
    [
      findSubgreddiit({_id: comment.commentedIn}),
      findUser({username: request.username})
    ]
  )
  if (!subgreddiit.followers.filter((follower) => (follower.username === request.username)).length)
    return response.sendStatus(401)

  await downvote(comment, user)
  response.sendStatus(200)
})

commentsRouter.delete("/:id/vote", async (request, response) => {
  const comment = await findCommentID(request.params.id)
  if (comment === null)
    return response.sendStatus(404)

  const [subgreddiit, user] = await Promise.all(
    [
      findSubgreddiit({_id: comment.commentedIn}),
      findUser({username: request.username})
    ]
  )
  if (!subgreddiit.followers.filter((follower) => (follower.username === request.username)).length)
    return response.sendStatus(401)

  await removeVote(comment, user)
  response.sendStatus(200)
})


commentsRouter.post("", async (request, response, next) => {
  if (!request.body.comment)
    return response.status(400).send({errors: ["Comment is required"], fields: ["comment"]})

  if (!request.body.commentedOn)
    return response.status(400).send({errors: ["A commented on is required"], fields: ["commentedOn"]})

  const [post, user] = await Promise.all([
    findPostID(request.body.commentedOn, false),
    findUser({username: request.username})
  ])
  if (post === null)
    return response.status(404)

  if (!post.postedIn.followers.filter((follower) => (follower.equals(user._id))).length)
    return response.sendStatus(401)

  try {
    const comment = await createNewComment({comment: request.body.comment, post, user})
    return response.send(comment)
  } catch (e) {
    next(e)
  }
})

module.exports = commentsRouter