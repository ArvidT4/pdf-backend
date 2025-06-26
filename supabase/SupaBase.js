require('dotenv').config()  // ✅ Must be at the top

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

const insertTest = async () => {
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL)

    const { data, error } = await supabase
        .from('test_data')
        .insert([{ message: 'Hello supabase' }])
        .select();

    if (error) {
        console.log('insert error', error)
    } else {
        console.log('insert data', data)
    }
}
const signUp = async (user) => {

    const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password
    });
    if (error) {
        console.log('insert error', error)
        return error
    } else {
        console.log('insert data', data)
        return data.session.access_token
    }
    return "nop"
}
const signIn = async (user) => {

    const { data, error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password
    });
    if (error) {
        console.log('insert error', error)
        return error
    } else {
        console.log('insert data', data)
        return data.session.access_token
    }
    return "nop"
}

module.exports = { insertTest, supabase,signUp, signIn }
