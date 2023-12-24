const mongoose = require("mongoose");


const UserSchema = mongoose.Schema({
    email: {
      type: String,
      unique: true, // Ensure email is unique
      required: true // Email is a required field
    },
    password: {
      type: String,
      required: true // Password is a required field
    },
    userName: {
      type: String,
      required: true // Username is a required field
    }
  });

const Users = mongoose.model("User", UserSchema);
module.exports = Users