const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

const stars = [];
for(let i=0;i<100;i++){
  stars.push({x: Math.random()*canvas.width, y: Math.random()*canvas.height, r: Math.random()*2+1, dx: (Math.random()-0.5)/2, dy: (Math.random()-0.5)/2});
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  stars.forEach(s=>{
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fillStyle = "white";
    ctx.fill();
    s.x += s.dx;
    s.y += s.dy;

    if(s.x<0||s.x>canvas.width)s.dx*=-1;
    if(s.y<0||s.y>canvas.height)s.dy*=-1;
  });
  requestAnimationFrame(animate);
}
animate();
