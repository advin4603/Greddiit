const Report = require("../models/report")

const reportLifeDays = 10 // DAYS

async function createReport(reporter, post, concern) {
  const newReport = new Report({concern, reporter: reporter._id, reportedIn: post.postedIn._id, post: post._id})
  await newReport.save();
  return newReport;
}

async function getReportID(id) {
  const report = await Report.findById(id)
    .populate("reporter", "username")
    .populate("reportedIn", "title")
    .populate("post", "title post postedBy")
  if (!report.ignored && new Date(report.createdAt) < new Date(Date.now() - reportLifeDays * 24 * 60 * 60 * 1000)) {
    Report.deleteOne({_id: id})
    return null
  }
  return report
}

async function getReportsInSubgreddiit(subgreddiit) {
  await Report.deleteMany({
    reportedIn: subgreddiit._id,
    ignored: false,
    createdAt: {$lt: new Date(Date.now() - reportLifeDays * 24 * 60 * 60 * 1000)}
  })
  return Report.find({reportedIn: subgreddiit._id})
    .populate("reporter", "username")
    .populate("reportedIn", "title")
    .populate("post", "title post postedBy")
}

async function ignoreReport(report) {
  return Report.updateOne({_id: report._id}, {ignored: true})
}

async function blockReported(report) {
  return Report.updateOne({_id: report._id}, {blocked: true})
}

module.exports = {
  createReport,
  ignoreReport,
  blockReported,
  getReportsInSubgreddiit,
  getReportID
}