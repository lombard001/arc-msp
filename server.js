const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

// Upload klasörü
const uploadFolder = 'public/uploads';
if (!fs.existsSync(uploadFolder)){
    fs.mkdirSync(uploadFolder, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadFolder),
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// Static klasör
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Basic Auth
function checkAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) {
        res.setHeader('WWW-Authenticate', 'Basic realm="MSP2 Admin"');
        return res.status(401).send('Authentication required.');
    }
    const [user, pass] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
    if (user === 'admin' && pass === 'sehan123') return next();
    res.setHeader('WWW-Authenticate', 'Basic realm="MSP2 Admin"');
    return res.status(401).send('Authentication failed.');
}

// Admin sayfası
app.get('/admin', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// Fotoğraf yükleme
app.post('/upload', checkAuth, upload.array('photos', 50), (req, res) => {
    const photoName = req.body.photoName || '';
    req.files.forEach(file => {
        if(photoName){
            const ext = path.extname(file.originalname);
            const newPath = path.join(file.destination, photoName + ext);
            fs.renameSync(file.path, newPath);
            file.filename = photoName + ext;
        }
    });
    res.redirect('/admin');
});

// Fotoğraf listesi JSON
app.get('/uploads/list', checkAuth, (req, res) => {
    let files = [];
    try { files = fs.readdirSync(uploadFolder); } catch (err) {}
    res.json(files);
});

// Home sayfası
app.get(['/','/home'], (req, res) => {
    let files = [];
    try { files = fs.readdirSync(uploadFolder); } catch (err) {}
    let html = `
    <html>
    <head>
      <link rel="stylesheet" href="/style.css">
      <title>MSP2 Varlık Yönetici</title>
    </head>
    <body>
      <h1>MSP2 Varlık Yönetici</h1>
      <div class="gallery">`;
    files.forEach(file => {
        const name = path.parse(file).name;
        html += `<div class="gallery-item">
                    <img src="/uploads/${file}">
                    <span class="photoName">${name}</span>
                 </div>`;
    });
    html += `</div></body></html>`;
    res.send(html);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
