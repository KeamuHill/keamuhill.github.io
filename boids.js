
const canvas = document.getElementById('boidsCanvas');
const ctx = canvas.getContext('2d');

const mouse = {
    x: -1000,  
    y: -1000
};

document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

document.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

if (window.innerWidth > 768) {
    document.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
    });

    document.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
    });

    document.addEventListener('touchend', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });
}


function resizeCanvas() 
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

window.addEventListener('resize', resizeCanvas);

class Star
{
    constructor() 
    {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5;           
        this.opacity = Math.random() * 0.5 + 0.3;  
        this.twinkleSpeed = Math.random() * 0.01 + 0.005;  
    }

    update() 
    {
        this.opacity += this.twinkleSpeed;

        if (this.opacity > 0.8 || this.opacity < 0.2) {
            this.twinkleSpeed *= -1;  
        }
    }

    draw() 
    {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.2})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}


class Boid 
{
    constructor() 
    {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.vx = (Math.random() - 0.5) * 1;  
        this.vy = (Math.random() - 0.5) * 1;
        
        this.size = 6;  
    }

    update(boids) 
    {
        let separationX = 0, separationY = 0;  // Rule 1: Separation
        let alignmentX = 0, alignmentY = 0;    // Rule 2: Alignment
        let cohesionX = 0, cohesionY = 0;      // Rule 3: Cohesion
        let neighbours = 0; 

        for (let other of boids) 
            {
            if (other === this) continue;  
            
            const dx = other.x - this.x;
            const dy = other.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);  

            if (dist < 100 && dist > 0) 
            {
                separationX -= dx / dist; 
                separationY -= dy / dist;

                alignmentX += other.vx;
                alignmentY += other.vy;

                cohesionX += other.x;
                cohesionY += other.y;

                neighbours++;
            }
        }

        if (neighbours > 0) 
            {
            alignmentX /= neighbours;
            alignmentY /= neighbours;
            
            cohesionX = (cohesionX / neighbours - this.x) * 0.005;
            cohesionY = (cohesionY / neighbours - this.y) * 0.005;
        }

        const mouseDx = mouse.x - this.x;
        const mouseDy = mouse.y - this.y;
        const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
        
        if (mouseDist < 200 && mouseDist > 0)
        {
            const avoidStrength = (200 - mouseDist) / 200;
            separationX -= (mouseDx / mouseDist) * avoidStrength * 8;
            separationY -= (mouseDy / mouseDist) * avoidStrength * 8;
        }


        this.vx += separationX * 0.03 + alignmentX * 0.03 + cohesionX;
        this.vy += separationY * 0.03 + alignmentY * 0.03 + cohesionY;

        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const maxSpeed = 1.5;
        if (speed > maxSpeed) 
        {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() 
    {
        const angle = Math.atan2(this.vy, this.vx);

        ctx.save();
        
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);
        
        ctx.fillStyle = 'rgba(212, 212, 216, 0.6)';
        ctx.beginPath();
        ctx.moveTo(this.size * 2, 0);          
        ctx.lineTo(-this.size, this.size);     
        ctx.lineTo(-this.size, -this.size);   
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
}


const stars = [];
for (let i = 0; i < 300; i++) 
{
    stars.push(new Star());
}

const boids = [];
const boidCount = Math.floor((window.innerWidth * window.innerHeight) / 8000);
for (let i = 0; i < Math.max(60, boidCount); i++)
{
    boids.push(new Boid());
}


let isPaused = false;
let animationId = null;  

const pauseBtn = document.getElementById('pauseBtn');

pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused; 
    
    if (isPaused)
    {
        pauseBtn.textContent = '▶';
        cancelAnimationFrame(animationId);
    } 
    else 
    {
        pauseBtn.textContent = '❚❚';
        animate();
    }
});


function animate() 
{
    if (isPaused) return;  

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let star of stars)
    {
        star.update();
        star.draw();
    }

    for (let boid of boids)
    {
        boid.update(boids);  
        boid.draw();
    }

    animationId = requestAnimationFrame(animate);
}

animate();