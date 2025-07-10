require('dotenv').config(); // ✅ Must be at the top
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_KEY;

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


const genFiles=async(token)=>{
    const supabase = getSupaClient(token);

    const { data, error } = await supabase
        .storage
        .from('pdf-bucket')
        .list(extractUserId(token));

    console.log('Files in folder:', data);
}
const generateFileFromSupabase = async (filePath, token) => {
    try {


        const cleanedPath = String(filePath).trim();
        console.log(JSON.stringify(cleanedPath));

        const supabase = getSupaClient(token);



        const { data, error } = await supabase
            .storage
            .from('pdf-bucket')
            .createSignedUrl(cleanedPath, 60);

        if (error) {
            console.error('Supabase error:', error);
            return null;
        }

        const signedUrl = data.signedUrl;
        console.log('Signed URL:', signedUrl); // Optional
        return signedUrl;
    } catch (err) {
        console.error('generate error', err);
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

module.exports = {getSupaClient, signUp, signIn, insertPdf, generateFileFromSupabase,genFiles };
