const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const UserAuth = require("../models/userAuth")

const token_secret = "n%xdz+o84:I%nR@n$P5Z^%h)@9M8*Zl{V#FeM&w<>`{:]8PP/;(l'3yM~?992iz"


async function createHashedPassword({password}){
  return await bcrypt.hash(password, saltRounds)
}

async function createAuthUser(userId, hash){
  const newUserAuth = new UserAuth({user: userId, hash: hash})
  await newUserAuth.save();
  return newUserAuth
}

function generateJWT(payload) {
  return jwt.sign(payload, token_secret)
}

async function findUserAuth(userId) {
  const userAuth = await UserAuth.findOne({user: userId})
  return userAuth;
}

async function comparePassword(password, passwordHash) {
  const match = await bcrypt.compare(password, passwordHash)
  return match
}


module.exports = {createHashedPassword, createAuthUser, generateJWT, findUserAuth, comparePassword, token_secret}
