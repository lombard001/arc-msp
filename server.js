const express = require('express');
const basicAuth = require('express-basic-auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Upload klasörü yoksa oluştur
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Multer ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// Statik dosyalar (CSS, JS)
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOAD_DIR));

// Admin Auth
app.use('/admin', basicAuth({
  users: { 'admin': 'sehan123' },
  challenge: true
}));

// Home Sayfası
app.get('/home', (req, res) => {
  const files = fs.readdirSync(UPLOAD_DIR);
  let imagesHtml = '';
  files.forEach(file => {
    imagesHtml += `<div class="photo-container">
                     <img src="/uploads/${file}" alt="${file}">
                     <p>${file}</p>
                   </div>`;
  });

  const html = `
  <!DOCTYPE html>
  <html lang="tr">
  <head>
    <meta charset="UTF-8">
    <title>MSP2 Home</title>
    <link rel="stylesheet" href="/public/css/style.css">
    <script src="/public/js/stars.js" defer></script>
    <script src="/public/js/lightbox.js" defer></script>
  </head>
  <body>
    <h1 class="title">MSP2 ARC</h1>
    <div class="gallery">${imagesHtml}</div>
  </body>
  </html>
  `;
  res.send(html);
});

// Admin Sayfası
app.get('/admin', (req, res) => {
  const html = `
  <!DOCTYPE html>
  <html lang="tr">
  <head>
    <meta charset="UTF-8">
    <title>MSP2 Admin</title>
    <link rel="stylesheet" href="/public/css/style.css">
    <script src="/public/js/stars.js" defer></script>
  </head>
  <body>
    <h1 class="title">Control Panel</h1>
    <form action="/admin/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="photo" required>
      <button type="submit">Yükle</button>
    </form>
    <form action="/admin/delete" method="post">
      <input type="text" name="filename" placeholder="Silinecek dosya adı" required>
      <button type="submit">Sil</button>
    </form>
  </body>
  </html>
  `;
  res.send(html);
});

// Fotoğraf yükleme
app.post('/admin/upload', upload.single('photo'), (req, res) => {
  res.redirect('/admin');
});

// Fotoğraf silme
app.post('/admin/delete', express.urlencoded({ extended: true }), (req, res) => {
  const filePath = path.join(UPLOAD_DIR, req.body.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  res.redirect('/admin');
});

// Sunucu başlat
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));
