const express = require('express')
const router = express.Router()
const { insertTest,signUp } = require('../supabase/SupaBase')

router.post('/', async function (req, res, next) {
  user=req.body
  response=await signUp(user)
  res.json(response);
})

module.exports = router