require("dotenv").config();

const DATABASE_KEY = process.env.DATABASE_KEY;
const mongoose = require("mongoose");

mongoose.connect( DATABASE_KEY );

// Create a Schema for Users
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

// Create a model from the schema
const Account = mongoose.model("Account", accountSchema);
const User = mongoose.model("User", UserSchema);

module.exports = { User,Account };
