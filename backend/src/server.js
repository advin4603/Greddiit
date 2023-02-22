const app = require( "./app");
const mongoose = require("mongoose");

const port = 8080;

const mongoDB = "mongodb://localhost:27017/greddiit"
mongoose.set('strictQuery', false)
async function main() {
  await mongoose.connect(mongoDB)
  app.listen(port);
  console.log(`Listening for requests on port ${port}`)
}

main()
