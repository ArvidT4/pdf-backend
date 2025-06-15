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

module.exports = { insertTest, supabase }
