const express = require('express')
const router = express.Router()
const { insertTest } = require('../supabase/SupaBase')

router.get('/', async function (req, res, next) {

  await insertTest()
  res.render('index', { title: 'Exsress' })
})

module.exports = router