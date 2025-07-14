var express = require('express');
var router = express.Router();
const {generateToken,genCookie,checkCookie}=require('./middlewares')
/* GET users listing. */
const { insertTest,signUp,signIn,verifyUser } = require('../supabase/SupaBase')


router.post('/auth',async function(req,res,next){
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });
  let user=await verifyUser(token)
  genCookie(res,"supaToken",token)
  genCookie(res,"token",generateToken(user))
  res.json("cookies set")
})
router.post('/signUp', async function (req, res, next) {
  let user = req.body
  let response = await signUp(user)
  if(response.success){
    genCookie(res,"supaToken",response.token)
    genCookie(res,"token",generateToken(user))
  }
  res.json(response);
})
router.post('/signIn', async function (req, res, next) {
  const user = req.body;
  const response = await signIn(user);

  if (response.success) {
    genCookie(res,"supaToken",response.token)
    genCookie(res,"token",generateToken(user))
  }

  res.json(response);
});

router.get('/secret', checkCookie, async function (req, res) {
  res.json({ message: "This is a protected route!", user: req.user });
});

module.exports = router;
