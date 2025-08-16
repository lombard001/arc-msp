const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.style.position = 'fixed';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-1';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

const stars = [];
const STAR_COUNT = 100;
const maxDistance = 150;

for(let i=0;i<STAR_COUNT;i++){
    stars.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        vx: (Math.random()-0.5)*0.5,
        vy: (Math.random()-0.5)*0.5,
        radius: Math.random()*2+1
    });
}

let mouse = {x:null,y:null};

canvas.addEventListener('mousemove', e=>{
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    for(let star of stars){
        star.x += star.vx;
        star.y += star.vy;

        if(star.x < 0 || star.x > canvas.width) star.vx *= -1;
        if(star.y < 0 || star.y > canvas.height) star.vy *= -1;

        if(mouse.x !== null && mouse.y !== null){
            const dx = star.x - mouse.x;
            const dy = star.y - mouse.y;
            const dist = Math.sqrt(dx*dx+dy*dy);
            if(dist<100){
                star.vx = -star.vx;
                star.vy = -star.vy;
            }
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI*2);
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    for(let i=0;i<stars.length;i++){
        for(let j=i+1;j<stars.length;j++){
            const dx = stars[i].x - stars[j].x;
            const dy = stars[i].y - stars[j].y;
            const dist = Math.sqrt(dx*dx+dy*dy);
            if(dist < maxDistance){
                ctx.beginPath();
                ctx.moveTo(stars[i].x, stars[i].y);
                ctx.lineTo(stars[j].x, stars[j].y);
                ctx.strokeStyle = 'rgba(255,255,255,'+(1-dist/maxDistance)+')';
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
