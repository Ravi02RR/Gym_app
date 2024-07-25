// const mongoose = require("mongoose");
const { verifyJWT } = require("../utils/jwt.utils");

const auth = async (req, res, next) => {
    try {
        // Get the token from the Authorization header
        // const token = req.header("Authorization").replace("Bearer ", "");

        // Get the token from the cookie
        const token = req.cookies.doitAuthCookie;
        if (!token) {
            throw new Error("auth -> No token provided.");
        }

        // Verify & extract the token
        const { _id } = verifyJWT(token);

        // if the token is invalid, throw an error
        if (!_id) {
            throw new Error("auth -> Id not found.");
        }

        // set the user id in the request object
        req.body.userId = _id;

        next();
    } catch (e) {
        res.status(401).json({message: `auth -> ${e.message}`});
    }
};

module.exports = auth;
