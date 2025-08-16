const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.zIndex = '-1';

const ctx = canvas.getContext('2d');
const stars = [];
const STAR_COUNT = 120;

// Rastgele pastel renk üretmek için
function randomStarColor() {
  const colors = ['#0ff', '#6ef', '#8f8', '#ff8', '#f8f'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Yıldızları oluştur
for (let i = 0; i < STAR_COUNT; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    dx: (Math.random() - 0.5) * 0.4,
    dy: (Math.random() - 0.5) * 0.4,
    color: randomStarColor(),
    alpha: Math.random() * 0.5 + 0.5,
    alphaChange: (Math.random() * 0.02 + 0.005)
  });
}

// Animasyon fonksiyonu
function draw() {
  // Hafif transparan arka plan (yıldız izleri için)
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  stars.forEach(s => {
    // Yıldızı çiz
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${parseInt(s.color.slice(1,3),16)},${parseInt(s.color.slice(3,5),16)},${parseInt(s.color.slice(5,7),16)},${s.alpha})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = s.color;
    ctx.fill();

    // Pozisyonu güncelle
    s.x += s.dx;
    s.y += s.dy;

    if (s.x < 0 || s.x > canvas.width) s.dx *= -1;
    if (s.y < 0 || s.y > canvas.height) s.dy *= -1;

    // Alfa animasyonu (parlama efekti)
    s.alpha += s.alphaChange;
    if (s.alpha > 1 || s.alpha < 0.3) s.alphaChange *= -1;
  });

  requestAnimationFrame(draw);
}

// Başlat
draw();

// Pencere boyutu değişirse canvas güncelle
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
