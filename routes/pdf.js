var express = require('express');
var router = express.Router();
const { insertPdf } = require('../supabase/SupaBase')


router.post("/insertPdf",async function(req,res){
    pdf=req.body;
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    res.json(await insertPdf(pdf, token))
})
module.exports=router