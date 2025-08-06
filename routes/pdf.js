var express = require('express');
var router = express.Router();
const multer = require('multer');

const { insertPdf,selectPdfTable,generatePdf } = require('../supabase/SupaBase')
const {checkCookie}=require('./middlewares')
const upload = multer({ storage: multer.memoryStorage() }); // or use diskStorage()

const streamToBuffer = (stream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];

        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
};
router.get("/selectPdfs",checkCookie,async function(req,res,next){
    const supaToken = req.cookies.supaToken;
    console.log("testar")
    res.json(await selectPdfTable(supaToken))

})
router.post("/insertPdf",checkCookie, upload.single('pdf'), async function(req,res){

    const title=req.body.title;
    console.log(title)
    const file=req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const supaToken = req.cookies.supaToken;

    res.json(await insertPdf(title, supaToken, file))
})
router.get("/generatePdfFile",checkCookie, async function(req, res) {
    const filePath = req.headers.filepath; // ✅ Now works!
    console.log(filePath)
    if (!filePath) {
        return res.status(400).json({ error: "Missing filePath in request body" });
    }
    const token=req.cookies.supaToken

    //const signedUrl=await generatePdf(filePath,token)
    // if (!signedUrl) {
    //     return res.status(500).json({ error: "Could not generate signed URL" });
    // }

    const file = await generatePdf(filePath, token);
    console.log(file)
    res.setHeader("Content-Type", "application/pdf");
    res.send(file);
});
module.exports=router