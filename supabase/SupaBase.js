require('dotenv').config(); // ✅ Must be at the top
const jwt = require('jsonwebtoken');

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_KEY;

// ✅ Reusable client with optional token for auth
const getSupaClient = (token) => {
    console.log(token)
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: {
            headers: {
                ...(token && { Authorization: `Bearer ${token}` })
            }
        }
    });
};

// ✅ Insert PDF and link it to authenticated user
const insertPdf = async (pdf, token) => {
    try {
        console.log(token)

        const supabase = getSupaClient(token);
        const decoded = jwt.decode(token);
        const userId = decoded?.sub;

        const { data, error } = await supabase.from('pdfs').insert([{
            pdf,
            user_id: userId
        }]);

        if (error) {
            console.error('Insert error:', error);
            return { error };
        }

        console.log('Insert success:', data);
        return { data };
    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: err };
    }
};
const insertBucketPdf = async (pdf, token) => {
    try {
        console.log(token)

        const supabase = getSupaClient(token);
        const decoded = jwt.decode(token);
        const userId = decoded?.sub;

        const {data:uploadData,error:uploadError}=await supabase.storage.from('pdf-bucket').createSignedUrl(pdf,60)
    } catch (err) {
        console.error('Unexpected error:', err);
        return { error: err };
    }
};
// ✅ Signup
const signUp = async (user) => {
    const supabase = getSupaClient();
    const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password
    });

    if (error) {
        console.log('Signup error', error);
        return error;
    }

    return data.session?.access_token || null;
};

// ✅ Signin
const signIn = async (user) => {
    const supabase = getSupaClient();
    const { data, error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password
    });

    if (error) {
        console.log('Signin error', error);
        return error;
    }

    return data.session?.access_token || null;
};

module.exports = { signUp, signIn, insertPdf };
