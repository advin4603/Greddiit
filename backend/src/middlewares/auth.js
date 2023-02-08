const jwt = require('jsonwebtoken');
const {token_secret} = require("../controllers/authController")
const {decode} = require("jsonwebtoken");

async function authenticate(request, response, next) {
  const authHeader = request.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (token == null)
    return response.sendStatus(401)

  try {
    const decoded = await jwt.verify(token,token_secret)
    request.username = decoded.username
  } catch (e) {
    return response.sendStatus(401)
  }
  next()
}

module.exports = {authenticate}
