const app = require( "./app");
const mongoose = require("mongoose");

const host = "0.0.0.0"
const port = 8080;

const mongoDB = "mongodb://mongodb:27017/greddiit"
mongoose.set('strictQuery', false)
mongoose.set('runValidators', true);
async function main() {
  await mongoose.connect(mongoDB)
  app.listen(port, host);
  console.log(`Listening for requests on http://${host}:${port}`)
}

main()
