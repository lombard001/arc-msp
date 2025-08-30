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
  const files = fs.readdirSync(UPLOAD_DIR);

  let filesHtml = '';
  files.forEach(file => {
    filesHtml += `
      <div style="margin-bottom:5px;">
        <input type="checkbox" name="filesToDelete" value="${file}" id="${file}">
        <label for="${file}">${file}</label>
      </div>
    `;
  });

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

    <!-- Çoklu yükleme formu -->
    <form action="/admin/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="photos" multiple required>
      <button type="submit">Yükle</button>
    </form>

    <!-- Toplu silme formu -->
    <form action="/admin/delete" method="post">
      ${filesHtml}
      <button type="submit" style="margin-top:10px;">Seçilenleri Sil</button>
    </form>
  </body>
  </html>
  `;
  res.send(html);
});

// Çoklu fotoğraf yükleme
app.post('/admin/upload', upload.array('photos', 20), (req, res) => {
  res.redirect('/admin');
});

// Toplu fotoğraf silme
app.post('/admin/delete', express.urlencoded({ extended: true }), (req, res) => {
  let files = req.body.filesToDelete;

  // Tek dosya seçilmişse string, çoksa array olur
  if (!files) return res.redirect('/admin');
  if (!Array.isArray(files)) files = [files];

  files.forEach(file => {
    const filePath = path.join(UPLOAD_DIR, file);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  });

  res.redirect('/admin');
});

// Sunucu başlat
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));
