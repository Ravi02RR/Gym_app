const User = require("../models/user.model");
const { uploadProfilePicture } = require("../utils/cloudinary.utils.js");

const updateUser = async (req, res) => {
    try {
        // Destructuring the request body
        const { userId, name, username } = req.body;

        //  Checking if userId is provided
        if (!userId) {
            return res
                .status(400)
                .json({
                    message: "updateUserController -> userId is mandatory",
                });
        }

        if (req.file) {
            // check if profile picture is uploaded successfully to the server
            const profilePictureLocalPath = req.file.path;
            if (!profilePictureLocalPath) {
                throw new Error("Error uploading profile picture to server");
            }

            // upload profile picture to cloudinary
            const profilePictureLink = await uploadProfilePicture(
                profilePictureLocalPath,
                userId
            );
            if (!profilePictureLink) {
                throw new Error(
                    "Error uploading profile picture to cloudinary"
                );
            }

            // Checking if at least one field is provided
            if (name || username || profilePictureLink) {
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    { $set: { name, username, profilePictureLink } },
                    { new: true }
                );
                if (!updatedUser) {
                    return res
                        .status(404)
                        .json({
                            message: "updateUserController -> User not found",
                        });
                }
                res.status(200).json(updatedUser);
            }
        }
    } catch (error) {
        res.status(500).json({
            message: `updateUserController -> Internal Server Error: ${error.message}`,
        });
    }
};

module.exports = updateUser;
