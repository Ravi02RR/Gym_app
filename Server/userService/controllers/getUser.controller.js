const User = require("../models/user.model");
const mongoose = require("mongoose");

const getUserInfo = async (req, res) => {
    try {
        const userId = req.body.userId;
        if (!userId) {
            return res.status(400).json({ message: "Invalid request" });
        }
        const retrievedUser = await User.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId.createFromHexString(userId),
                },
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    email: 1,
                    username: 1,
                    profilePictureLink: 1,
                },
            },
        ]);
        if (!retrievedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(retrievedUser);
    } catch (error) {
        res.status(500).json({
            message: `getUserController -> Internal server error: ${error.message}`,
        });
    }
};

module.exports = getUserInfo;
