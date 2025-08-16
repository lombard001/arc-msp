<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <title>Admin Panel</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <h1>MSP2 Varlık Yönetici - Admin</h1>

    <form id="uploadForm" action="/upload" method="POST" enctype="multipart/form-data">
        <input type="text" name="photoName" placeholder="Fotoğraf ismi">
        <input type="file" name="photos" id="photos" multiple>
        <button type="submit">Fotoğraf Yükle</button>
    </form>

    <h2>Yüklenen Fotoğraflar</h2>
    <div class="gallery" id="adminGallery"></div>

    <script>
        async function loadGallery(){
            const res = await fetch('/uploads/list', {headers:{Authorization:'Basic '+btoa('admin:sehan123')}});
            const files = await res.json();
            const gallery = document.getElementById('adminGallery');
            gallery.innerHTML = '';
            files.forEach(file => {
                const name = file.split('.')[0];
                const div = document.createElement('div');
                div.className = 'gallery-item';
                div.innerHTML = `<img src="/uploads/${file}"><span class="photoName">${name}</span>`;
                gallery.appendChild(div);
            });
        }
        loadGallery();
    </script>
</body>
</html>
