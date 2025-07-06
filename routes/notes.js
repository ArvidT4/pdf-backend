const express = require('express')
const router = express.Router()
const {insertNote}=require("../supabase/Notes")
router.post("/insertNote",async function(req,res){
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    note=req.body
    const response=await insertNote(token,note)
    return response
})
module.exports=router