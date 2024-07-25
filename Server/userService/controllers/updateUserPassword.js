const User = require("../models/user.model");

const updateUserPassword = async (req, res) => {
    try {
        const userId = req.body.userId;
        const newPassword = req.body.password;

        const retrievedUser = await User.findById(userId);
        retrievedUser.password = newPassword;
        const updatedUser = await retrievedUser.save();
        res.status(200).json(updatedUser);
    } catch (error) {}
};

module.exports = updateUserPassword;
