const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const basicAuth = require('express-basic-auth');

const app = express();
const PORT = process.env.PORT || 3000;

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
        const name = req.body.photoName || file.originalname;
        cb(null, Date.now() + '-' + name);
    }
});
const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/admin', basicAuth({
    users: { 'admin': 'sehan123' },
    challenge: true
}));

app.get(['/','/home'], (req,res)=>{
    res.sendFile(path.join(__dirname,'views','home.html'));
});

app.get('/admin', (req,res)=>{
    res.sendFile(path.join(__dirname,'views','admin.html'));
});

app.post('/upload', upload.single('photo'), (req,res)=>{
    res.redirect('/admin');
});

app.post('/delete', (req,res)=>{
    const fileName = req.body.fileName;
    const filePath = path.join(__dirname,'uploads',fileName);
    if(fs.existsSync(filePath)){
        fs.unlinkSync(filePath);
    }
    res.redirect('/admin');
});

app.get('/list-photos', (req,res)=>{
    const files = fs.readdirSync('uploads/');
    const data = files.map(file=>{
        return { file: file, name: file.split('-').slice(1).join('-') };
    });
    res.json(data);
});

app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`);
});
