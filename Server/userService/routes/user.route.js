const express = require("express");
const auth = require("../middlewares/auth.middleware");
const fetchAllUsers = require("../controllers/allUsers.controller");
const newUser = require("../controllers/newUser.controller");
const login = require("../controllers/login.controller");
const updateUser = require("../controllers/updateUser.controller");
const deleteUser = require("../controllers/deleteUser.controller");
const updateUserPassword = require("../controllers/updateUserPassword");
const upload = require("../middlewares/tempStoreToServer.middleware");
const cookieAuthenticator = require("../utils/cookieAuthenticator");
const getUserInfo  = require("../controllers/getUser.controller");

const userRouter = express.Router();

// create new user
userRouter.post("/new", upload.single("profilePicture"), newUser);

// get all users
userRouter.get("/all", fetchAllUsers);

// get user by id
userRouter.get("/", auth, getUserInfo);

// login
userRouter.post("/login", login);

// update user info
userRouter.put("/update", upload.single("profilePicture"), auth, updateUser);

// update password
userRouter.patch("/update/password", auth, updateUserPassword);

// delete user
userRouter.delete("/delete", auth, deleteUser);

// authenticate cookie
userRouter.get("/checkCookie", cookieAuthenticator);

module.exports = userRouter;
