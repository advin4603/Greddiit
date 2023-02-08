const app = require( "./app");
const mongoose = require("mongoose");

const mongoDB = "mongodb://localhost:27017/greddiit"
mongoose.set('strictQuery', false)
async function main() {
  await mongoose.connect(mongoDB)
  app.listen(8080);
}

main()
