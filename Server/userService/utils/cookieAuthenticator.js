const { verifyJWT } = require("./jwt.utils");

const cookieAuthenticator = (req, res) => {
    // extract JWT from cookie
    const token = req.cookies.doitAuthCookie;

    // verify JWT
    const decodedToken = verifyJWT(token);

    // if JWT is valid, return 200 status code and isAuthenticated: true
    if (decodedToken) {
        return res.status(200).json({ isAuthenticated: true });
    } else {
        return res.status(401).json({ isAuthenticated: false });
    }
};

module.exports = cookieAuthenticator;
