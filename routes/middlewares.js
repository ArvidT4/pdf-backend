const jwt = require('jsonwebtoken'); // ✅ add this at the top
require('dotenv').config(); // load environment variables
const secretKey = process.env.JWT_SECRET
const checkCookie = (req, res, next) => {
    const token = req.cookies.token;
    //console.log("TOKEN"+token)
    if (!token) {
        return res.status(401).json({ message: "No token found" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {

        if (err) {
            console.error("❌ Token verification failed:"  + " " + token); // <--- Lägg till denna

            return res.status(401).json({ message: "Invalid token" });
        } else {
            console.log("test")

            req.user = decoded; // attach decoded user info to request
            next(); // continue to the route handler
        }
    });
};
const generateToken=(user)=>{
    const payload = {
        email:user.email,
    };

    return jwt.sign(payload, secretKey, {expiresIn: '1d'})
}
const genCookie=(res,name,cookie)=>{
    res.cookie(name, cookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',  // true in production, false in development
        sameSite: 'lax',  // or 'strict'
        maxAge: 1000 * 60 * 60 * 24 // e.g. 1 day
    });
}
module.exports = {generateToken,genCookie,checkCookie}