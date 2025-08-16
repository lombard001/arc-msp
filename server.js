const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({ dest: 'public/uploads/' });

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const adminUser = 'admin';
const adminPass = 'sehan123';

function checkAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) {
        res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
        return res.status(401).send('Authentication required.');
    }
    const [user, pass] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
    if (user === adminUser && pass === adminPass) {
        return next();
    } else {
        return res.status(403).send('Forbidden');
    }
}

// Admin paneli
app.get('/admin', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// Fotoğraf yükleme
app.post('/upload', checkAuth, upload.array('photos', 50), (req, res) => {
    res.redirect('/admin');
});

// Fotoğraf silme
app.post('/delete', checkAuth, (req, res) => {
    const files = Array.isArray(req.body.files) ? req.body.files : [req.body.files];
    files.forEach(file => {
        const filePath = path.join(__dirname, 'public/uploads', file);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
    res.redirect('/admin');
});

// Ana sayfa /home
app.get('/home', (req, res) => {
    const files = fs.readdirSync('public/uploads');
    let html = `<h1 style="text-align:center;">MSP2 Varlık Yönetici</h1>
                <div style="display:grid; grid-template-columns:repeat(5,1fr); gap:10px; padding:20px;">`;
    files.forEach(file => {
        html += `<img src="/uploads/${file}" style="width:100%; border-radius:5px;">`;
    });
    html += `</div>`;
    res.send(html);
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
