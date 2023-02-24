const {Router, request} = require("express")
const {findPostID, deletePost} = require("../controllers/postController");
const {findUser} = require("../controllers/userController");
const {findSubgreddiit, blockFollower, addDeleteLog, addReportLog} = require("../controllers/subgreddiitController");
const {createReport, getReportID, ignoreReport, blockReported} = require("../controllers/reportController");

const reportsRouter = Router()

reportsRouter.post("/:id/ignore", async (request, response) => {
  const report = await getReportID(request.params.id);
  if (report == null)
    return response.sendStatus(404)
  if (report.blocked)
    return response.sendStatus(405)
  const [subgreddiit, post] = await Promise.all([
    findSubgreddiit({title: report.reportedIn.title}), findPostID(report.post._id)
  ])
  if (subgreddiit.moderator.username !== request.username)
    return response.sendStatus(401)

  await ignoreReport(report);
  return response.sendStatus(200)
})

reportsRouter.post("/:id/block", async (request, response) => {
  const report = await getReportID(request.params.id);
  if (report.ignored)
    return response.sendStatus(405)
  const [subgreddiit, post] = await Promise.all([
    findSubgreddiit({title: report.reportedIn.title}), findPostID(report.post._id)
  ])
  if (subgreddiit.moderator.username !== request.username)
    return response.sendStatus(401)

  await Promise.all([blockReported(report), blockFollower(subgreddiit, post.postedBy)]);
  return response.sendStatus(200)
})

reportsRouter.post("/:id/deletePost", async (request, response) => {
  const report = await getReportID(request.params.id);
  if (report.blocked || report.ignored)
    return response.sendStatus(405)
  const [subgreddiit, post] = await Promise.all([
    findSubgreddiit({title: report.reportedIn.title}), findPostID(report.post._id)
  ])
  if (subgreddiit.moderator.username !== request.username)
    return response.sendStatus(401)

  await Promise.all([deletePost(post), addDeleteLog(subgreddiit)]);
  return response.sendStatus(200)
})

reportsRouter.post("", async (request, response, next) => {
  if (!request.body.post)
    return response.sendStatus(400)
  const [post, user] = await Promise.all([findPostID(request.body.post), findUser({username: request.username})])
  if (post.postedBy.username === user.username)
    return response.sendStatus(405)
  const subgreddiit = await findSubgreddiit({title: post.postedIn.title})
  if (subgreddiit.followers.filter(follower => follower.username === user.username).length === 0)
    return response.sendStatus(401)

  if (!request.body.concern)
    return response.sendStatus(400)

  try {
    await Promise.all(
      [
        createReport(user, post, request.body.concern),
        addReportLog(subgreddiit)
      ]
    )
    return response.sendStatus(200)
  } catch (e) {
    next(e)
  }
})

module.exports = reportsRouter