const User = require("../models/user.model");
// const Todo = require("../../models/todo.model");
const { deleteProfilePicture } = require("../utils/cloudinary.utils");

const deleteUser = async (req, res) => {
    try {
        // extract user ID from request body
        const userId = req.body.userId;

        // check if user ID is provided
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // delete the user's profile picture from cloudinary
        const deletePP = await deleteProfilePicture(userId);

        // check if user profile picture is successfully deleted
        if (!(deletePP.result === "ok")) {
            throw new Error(
                "Error deleting user profile picture from cloudinary"
            );
        }

        // delete all todos of the user
        // const deleteUserTodos = await Todo.deleteMany({ userId: userId });

        // check if user todos are successfully deleted
        // if (!deleteUserTodos) {
        //     throw new Error("Error deleting user todos");
        // }

        // delete the user data
        const deletedUser = await User.findOneAndDelete({ _id: userId });

        // check if user is successfully deleted
        if (!deletedUser) {
            throw new Error("Error deleting user");
        }

        res.status(200).json({
            message: `User with username ${deletedUser.username} and all its data are deleted successfully`,
        });
    } catch (error) {
        res.status(500).json({
            message: `Internal Server Error: ${error.message}`,
        });
    }
};

module.exports = deleteUser;
