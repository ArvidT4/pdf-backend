const express = require('express')
const router = express.Router()
const { insertTest,signUp,signIn } = require('../supabase/SupaBase')
const jwt = require('jsonwebtoken'); // ✅ add this at the top
require('dotenv').config(); // load environment variables
const secretKey = process.env.JWT_SECRET || 'dev_secret_key';
const checkCookie = (req, res, next) => {
  const token = req.cookies.token;
  console.log("TOKEN"+token)
  if (!token) {
    return res.status(401).json({ message: "No token found" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    console.error("❌ Token verification failed:", err.message + " " + token); // <--- Lägg till denna

    if (err) {

      return res.status(401).json({ message: "Invalid token" });
    } else {
      console.log("test")

      req.user = decoded; // attach decoded user info to request
      next(); // continue to the route handler
    }
  });
};
const generateToken=(data)=>{
  const payload = {
    id: data.user.id,
    email: data.user.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
}
router.post('/signUp', async function (req, res, next) {
  user=req.body
  response=await signUp(user)
  if(response.success){
    res.cookie('token', response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',  // true in production, false in development
      sameSite: 'lax',  // or 'strict'
      maxAge: 1000 * 60 * 60 * 24 // e.g. 1 day
    });
  }
  res.json(response);
})
router.post('/signIn', async function (req, res, next) {
  const user = req.body;
  const response = await signIn(user);

  if (response.success) {
    res.cookie('token', response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });
  }

  res.json(response);
});

router.get('/secret', checkCookie, async function (req, res) {
  res.json({ message: "This is a protected route!", user: req.user });
});
module.exports = router