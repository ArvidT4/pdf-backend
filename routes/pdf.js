var express = require('express');
var router = express.Router();
const multer = require('multer');

const { insertPdf,generateFileFromSupabase,genFiles } = require('../supabase/SupaBase')

const upload = multer({ storage: multer.memoryStorage() }); // or use diskStorage()

router.post("/insertPdf", upload.single('pdf'), async function(req,res){
    const title=req.body;
    const file=req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    res.json(await insertPdf(title, token, file))
})
router.post("/generatePdf", async function(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const filePath = req.body.filePath; // ✅ Now works!

    if (!filePath) {
        return res.status(400).json({ error: "Missing filePath in request body" });
    }

    await genFiles(token); // optional debugging
    const signedUrl = await generateFileFromSupabase(filePath, token);

    if (!signedUrl) {
        return res.status(500).json({ error: "Could not generate signed URL" });
    }

    res.json({ signedUrl });
});
module.exports=router