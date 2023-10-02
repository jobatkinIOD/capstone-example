require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    // get the token from the request - either in body, query params or header (header preferred)
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        // bounce back to front end if no token. could also parse token here to check specific role
        return res.status(403).send("A token is required for authentication");
    }

    try {
        // decode/unlock the token based on the KEY
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        // store decoded user data into request for controller function to use
        req.user = decoded;
        console.log(decoded)
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    // successful authorisation, execute next part of the route - ie. the controller function
    return next();
};

const createToken = (userId, userEmail) => {
    const token = jwt.sign(
        { user_id: userId, userEmail },
        process.env.JWT_KEY,
        { expiresIn: "2h" }
    );
    return token;
}

module.exports = { verifyToken, createToken };