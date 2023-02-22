const {Router} = require("express")
const {
  createNewPost,
  findPostID,
  getPostsInSubgreddiit,
  deletePost,
  updatePost, upvote, downvote, removeVote, censor
} = require("../controllers/postController")
const {findUser} = require("../controllers/userController");
const {findSubgreddiit} = require("../controllers/subgreddiitController");
const {getCommentsOnPost} = require("../controllers/commentController");

const postsRouter = Router()

postsRouter.post("/:id/upvote", async (request, response) => {
  const post = await findPostID(request.params.id)
  if (post === null)
    return response.sendStatus(404)
  const [subgreddiit, user] = await Promise.all([findSubgreddiit({title: post.postedIn.title}), findUser({username: request.username})])
  if (!subgreddiit.followers.filter((follower) => (follower.username === request.username)).length)
    return response.sendStatus(401)

  await upvote(post, user)
  response.sendStatus(200)
})


postsRouter.post("/:id/downvote", async (request, response) => {
  const post = await findPostID(request.params.id)
  if (post == null)
    return response.sendStatus(404)
  const [subgreddiit, user] = await Promise.all([findSubgreddiit({title: post.postedIn.title}), findUser({username: request.username})])
  if (!subgreddiit.followers.filter((follower) => (follower.username === request.username)).length)
    return response.sendStatus(401)

  await downvote(post, user)
  response.sendStatus(200)
})

postsRouter.delete("/:id/vote", async (request, response) => {
  const post = await findPostID(request.params.id)
  if (post == null)
    return response.sendStatus(404)
  const [subgreddiit, user] = await Promise.all([findSubgreddiit({title: post.postedIn.title}), findUser({username: request.username})])
  if (!subgreddiit.followers.filter((follower) => (follower.username === request.username)).length)
    return response.sendStatus(401)

  await removeVote(post, user)
  response.sendStatus(200)
})

postsRouter.get("/:id/comments", async (request, response) => {
  const post = await findPostID(request.params.id)
  if (post == null)
    return response.sendStatus(404)
  const subgreddiit = await findSubgreddiit({title: post.postedIn.title})
  if (!subgreddiit.followers.filter((follower) => (follower.username === request.username)).length)
    return response.sendStatus(401)

  let comments = await getCommentsOnPost(post)
  comments = comments.map((comment) => {
    comment.comment = censor(comment.comment, subgreddiit.bannedKeywords)
    if (subgreddiit.moderator.username !== request.username && subgreddiit.blockedUsers.filter(
      blockedUser =>
        blockedUser.username === comment.commentedBy.username
    ).length > 0) {
      comment._doc.commentedBy = {username: "[blocked User]"}
    }
    return comment
  })
  response.send(comments)
})


postsRouter.get("/:id", async (request, response) => {
  const post = await findPostID(request.params.id)
  if (post == null)
    return response.sendStatus(404)

  const subgreddiit = await findSubgreddiit({title: post.postedIn.title})
  if (!subgreddiit.followers.filter((follower) => (follower.username === request.username)).length)
    return response.sendStatus(401)

  post.title = censor(post.title, subgreddiit.bannedKeywords)
  post.post = censor(post.post, subgreddiit.bannedKeywords)
  if (subgreddiit.moderator.username !== request.username && subgreddiit.blockedUsers.filter(
    blockedUser =>
      blockedUser.username === post.postedBy.username
  ).length > 0) {
    post._doc.postedBy = {username: "[blocked User]"}
  }
  response.send(post)
})


postsRouter.delete("/:id", async (request, response) => {
  const post = await findPostID(request.params.id)
  if (post == null)
    return response.sendStatus(404)

  if (post.postedBy.username !== request.username)
    return response.sendStatus(403)

  await deletePost(post)
  response.sendStatus(200)
})

postsRouter.patch("/:id", async (request, response, next) => {
  const post = await findPostID(request.params.id)
  if (post == null)
    return response.sendStatus(404)
  if (post.postedBy.username !== request.username)
    return response.sendStatus(403)

  const update = {};
  if (!request.body.title)
    update.title = request.body.title

  if (!request.body.post)
    update.post = request.body.post

  try {
    await updatePost(post, update)
    return response.sendStatus(200)
  } catch (e) {
    next(e)
  }
})


postsRouter.get("/subgreddiits/:title", async (request, response) => {
  const subgreddiit = await findSubgreddiit({title: request.params.title})
  if (subgreddiit === null)
    return response.sendStatus(404)
  if (!subgreddiit.followers.filter((follower) => (follower.username === request.username)).length)
    return response.sendStatus(401)

  let posts = await getPostsInSubgreddiit(subgreddiit);
  posts = posts.map((post) => {
    post.title = censor(post.title, subgreddiit.bannedKeywords)
    post.post = censor(post.post, subgreddiit.bannedKeywords)
    if (subgreddiit.moderator.username !== request.username && subgreddiit.blockedUsers.filter(
      blockedUser =>
        blockedUser.username === post.postedBy.username
    ).length > 0) {
      post._doc.postedBy = {username: "[blocked User]"}
    }
    return post
  })

  return response.send(posts);
})

postsRouter.post("", async (request, response, next) => {
  if (!request.body.title)
    return response.status(400).send({errors: ["Title is required"], fields: ["title"]})

  if (!request.body.post)
    return response.status(400).send({errors: ["Post is required"], field: ["post"]})

  if (!request.body.postedIn)
    return response.status(400).send({errors: ["Posted in is required"], field: ["postedIn"]})

  const [subgreddiit, user] = await Promise.all([findSubgreddiit({title: request.body.postedIn}), findUser({username: request.username})])
  if (subgreddiit === null)
    return response.status(404)
  if (!subgreddiit.followers.filter((follower) => (follower.username === request.username)).length)
    return response.sendStatus(401)

  try {
    const post = await createNewPost({
      title: request.body.title,
      post: request.body.post,
      postedBy: user,
      postedIn: subgreddiit
    })
    return response.send(post)
  } catch (e) {
    next(e)
  }

})


module.exports = postsRouter