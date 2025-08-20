const jwt = require('jsonwebtoken');
const {getSupaClient}=require("./SupaBase")

const insertNote= async (token,notes)=>{
    try{
        console.log("whtaf")
        const supabase=getSupaClient(token)
        console.log(notes)

        const {data,error}=await supabase.from('notes').insert([{
            filepath:notes.filepath,
            user_id:notes.user_id,
            content:notes.content,
            highlight_areas:notes.highlight_areas,
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
const selectNotesTable=async (supaToken)=>{
    try {
        const supabase=await getSupaClient(supaToken)
        const { data, error } = await supabase
            .from('notes')
            .select('*');
        if(error){
            console.log(error)
            return false
        }
        else{
            console.log(data)
            return data
        }
    }catch(err){
        console.log(err)
        return false
    }
}
module.exports={insertNote,selectNotesTable}