require('dotenv').config(); // ✅ Must be at the top
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const getSupaClient = (token) => {
    //console.log(jwt.decode(token))
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: {
            headers: {
                ...(token && { Authorization: `Bearer ${token}` })
            }
        }
    });
};
const extractUserId=(token)=>{
    const decoded = jwt.decode(token);
    const userId = decoded?.sub;
    return userId
}

const verifyUser=async (token)=>{
    const supabase=createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const {data:user,error}=await supabase.auth.getUser(token);

    if (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
    //console.log(user.user)
    return user.user

}
const selectPdfTable=async (supaToken)=>{
    try {
        const supabase=await getSupaClient(supaToken)
        const { data, error } = await supabase
            .from('pdfs')
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
const generatePdf = async (filePath, token) => {
    try {
        const supabase = getSupaClient(token);

        const { data: file, error } = await supabase
            .storage
            .from('pdf-bucket')
            .download(filePath.trim());

        if (error) {
            console.error("Supabase download error:", error);
            return null;
        }

        return file; // this is a readable stream
    } catch (err) {
        console.error('generatePdf error:', err);
        return null;
    }
};

const insertPdf = async (title, token,pdf) => {
    try {
        const supabase = getSupaClient(token);
        const uploadedPdf=await insertBucketPdf(pdf,token)

        const { data:dataPdf, error } = await supabase.from('pdfs').insert([{
            title:title,
            filepath:uploadedPdf,
            user_id: extractUserId(token)
        }]);

        if (error) {
            console.error('Insert error:', error);
            return { error };
        }
        console.log('Insert success:', dataPdf);
        return { dataPdf };
    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: err };
    }
};

const insertBucketPdf = async (pdf, token) => {
    try {
        const supabase = getSupaClient(token);
        const userId=extractUserId(token)

        const fileExt = pdf.originalname.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const {data:uploadData,error:uploadError}=await supabase.storage.from('pdf-bucket').upload(filePath, pdf.buffer, {
            cacheControl: '3600',
            upsert: false,
            contentType: 'application/pdf'
        });
        if(uploadError){
            console.log("Upload error", uploadError.message)
            return null
        }
        console.log('file uploaded', uploadData);
        return filePath;
    } catch (err) {
        console.log("FAWK")

        console.error('Unexpected error:', err);
        return { error: err };
    }
};


const signUp = async (user) => {
    const supabase = getSupaClient();
    const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password
    });

    if (error) {
        console.log('Signup error', error);
        return {success:false,error:error};
    }

    return {success:true, token:data.session?.access_token} || null;
};

const signIn = async (user) => {
    const supabase = getSupaClient();
    const { data, error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password
    });

    if (error) {
        console.log('Signin error', error);
        return {success:false,error:error};
    }

    return {success:true, token:data.session?.access_token} || null;
};

module.exports = {getSupaClient, signUp, signIn, insertPdf,verifyUser,selectPdfTable,generatePdf };
