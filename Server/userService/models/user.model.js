const mongoose = require("mongoose");
const { generateHash } = require("../utils/hash.utils");

// define user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profilePictureLink: {
        type: String,
        default: "",
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    friends: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        default: [],
    },
    friendrequests: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        default: [],
    },
});

// generate password hash before saving user
userSchema.pre("save", generateHash);

// define user model
const User = mongoose.model("User", userSchema);

module.exports = User;
