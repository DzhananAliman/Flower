const canvas = document.getElementById("roseCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const centerX = canvas.width / 2;
const centerY = canvas.height / 2 + 50;

class Particle {
  constructor(tx, ty, color) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.tx = tx;
    this.ty = ty;
    this.size = Math.random() * 1.5 + 1;
    this.color = color;
    this.exploding = false;
    this.vx = 0;
    this.vy = 0;
  }
  update() {
    if (!this.exploding) {
      this.x += (this.tx - this.x) * 0.05;
      this.y += (this.ty - this.y) * 0.05;
    } else {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.05;
    }
  }
  draw() {
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
    gradient.addColorStop(0, "white");
    gradient.addColorStop(1, this.color);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Функция за листа (по-плътни и цветни)
function createLeaves() {
  const leaves = [];
  const leafColorGradient = ["#2ecc71", "#27ae60", "#1abc9c"]; // модерни зелени

  for (let i = 0; i < 1500; i++) {
    const side = i < 750 ? -1 : 1;
    const angle = Math.random() * Math.PI / 3 - Math.PI / 6;
    const radiusX = 80;
    const radiusY = 30;

    const x = centerX + side * radiusX * Math.cos(angle) + (Math.random() - 0.5) * 20;
    const y = centerY + 50 + radiusY * Math.sin(angle) + (Math.random() - 0.5) * 20;

    const color = leafColorGradient[Math.floor(Math.random() * leafColorGradient.length)];
    leaves.push(new Particle(x, y, color));
  }
  return leaves;
}

function createRosePoints() {
  particles = [];
  const scale = 120;
  const density = 8000;
  const k = 4;

  // Частици за розата
  for (let i = 0; i < density; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r = scale * Math.sin(k * theta);
    const x = centerX + r * Math.cos(theta);
    const y = centerY + r * Math.sin(theta);

    const redGradient = ["#ff1a1a", "#ff4d4d", "#ff8080"];
    const color = redGradient[Math.floor(Math.random() * redGradient.length)];

    particles.push(new Particle(x, y, color));
  }

  // Стъбло
  for (let i = 0; i < 1000; i++) {
    const x = centerX + (Math.random() - 0.5) * 20;
    const y = centerY + 50 + Math.random() * 250;
    const greenGradient = ["#00cc44", "#00e65c", "#009933"];
    const color = greenGradient[Math.floor(Math.random() * greenGradient.length)];
    particles.push(new Particle(x, y, color));
  }

  // Листа
  const leaves = createLeaves();
  particles = particles.concat(leaves);
}

function explodeParticles() {
  particles.forEach(p => {
    p.exploding = true;
    p.vx = (Math.random() - 0.5) * 10;
    p.vy = (Math.random() - 0.5) * 10;
  });
  setTimeout(() => {
    createRosePoints();
  }, 2000);
}

function animate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}

createRosePoints();
animate();
setInterval(explodeParticles, 30000);

// resize canvas при смяна на размера на прозореца
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});


// Свързване на бутона за ръчна експлозия
document.getElementById("explodeBtn").addEventListener("click", explodeParticles);

