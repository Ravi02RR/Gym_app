const User = require("../models/user.model.js");
const { uploadProfilePicture } = require("../utils/cloudinary.utils.js");

const newUser = async (req, res) => {
    try {
        // extract user data from request body
        const { name, email, username, password } = req.body;

        // check if all necessary user data are provided
        if (!(name && email && username && password)) {
            return res.status(400).json({
                message:
                    "Name, email, username & password fields are mandatory",
            });
        }

        // check if the user already exists
        const existingUserCount = await User.countDocuments({
            $or: [{ username }, { email }],
        });
        if (existingUserCount > 0) {
            return res
                .status(409)
                .json({ message: "Username or email already exists" });
        }

        // >NOTE: saving user data except for profile picture
        // > so that I can use the user id to name the profile picture
        const user = new User({ name, email, username, password });
        const savedUser = await user.save();

        // if profile picture is provided, upload it to cloudinary
        if (req.file) {
            // check if profile picture is uploaded successfully to the server
            const profilePictureLocalPath = req.file.path;
            if (!profilePictureLocalPath) {
                throw new Error("Error uploading profile picture to server");
            }

            // upload profile picture to cloudinary
            const profilePictureLink = await uploadProfilePicture(
                profilePictureLocalPath,
                savedUser._id
            );
            if (!profilePictureLink) {
                throw new Error(
                    "Error uploading profile picture to cloudinary"
                );
            }

            // update user data with profile picture link
            const updatedUser = await User.findOneAndUpdate(
                { _id: savedUser._id },
                { $set: { profilePictureLink } },
                { new: true }
            );
            if (!updatedUser) {
                return res.status(404).json({
                    message:
                        "Error updating user profile picture: User not found",
                });
            }

            return res.status(201).json(updatedUser);
        }

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({
            message: `New User Controller: Internal server error: ${error.message}`,
        });
    }
};

module.exports = newUser;
