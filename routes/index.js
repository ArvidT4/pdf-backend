const express = require('express')
const router = express.Router()
const { insertTest,signUp,signIn } = require('../supabase/SupaBase')

router.post('/signUp', async function (req, res, next) {
  user=req.body
  response=await signUp(user)
  res.json(response);
})
router.post('/signIn', async function (req, res, next) {
  user=req.body
  response=await signIn(user)
  res.json(response);
})

module.exports = router