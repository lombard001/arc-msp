const express = require('express');
const basicAuth = require('express-basic-auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Storage ayarları
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Static klasörler
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Admin auth
app.use('/admin', basicAuth({
  users: { 'admin': 'sehan123' },
  challenge: true,
}));

// Home sayfası
app.get('/home', (req, res) => {
  const files = fs.readdirSync('./uploads');
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// Admin sayfası
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// Fotoğraf yükleme
app.post('/admin/upload', upload.single('photo'), (req, res) => {
  res.redirect('/admin');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
