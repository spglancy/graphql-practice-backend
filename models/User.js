const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: String,
  password: String
})

module.exports = mongoose.model("User", UserSchema)