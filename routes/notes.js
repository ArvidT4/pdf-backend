const express = require('express')
const router = express.Router()
const {insertNote,selectNotesTable}=require("../supabase/Notes")
const {checkCookie}=require('./middlewares')

router.post("/insertNote",checkCookie, async function(req,res){
    const supaToken = req.cookies.supaToken;

    note=req.body
    const response=await insertNote(supaToken,note)
    return response
})
router.get("/selectNotes",checkCookie,async function(req,res,next){
    const supaToken = req.cookies.supaToken;
    console.log("testar")
    res.json(await selectNotesTable(supaToken))

})
module.exports=router