const jwt = require('jsonwebtoken');
const {getSupaClient}=require("./SupaBase")

const insertNote= async (token,notes)=>{
    try{
        console.log("whtaf")
        const supabase=getSupaClient(token)
        const {data,error}=await supabase.from('notes').insert([{
            pdf_id:notes.pdf_id,
            user_id:notes.user_id,
            content:notes.content,
            highlight_areas:notes.highlight_area,
        }]).throwOnError();
        if(error){
            console.log(error)
            return {error}
        }
        console.log("data " + data)
        return {data}
    }catch(error){
        console.log("error catch" + error)
        return null
    }
}
module.exports={insertNote}