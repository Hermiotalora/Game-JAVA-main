const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const highScoreElement = document.getElementById("highScore");
const gameOverElement = document.getElementById("gameOver");
const startScreenElement = document.getElementById("startScreen");
const finalScoreElement = document.getElementById("finalScore");

let gameState = "start"; // start, playing, gameOver
let highScore = localStorage.getItem("arkanoidHighScore") || 0;
highScoreElement.textContent = highScore;

const platformWidth = 100;
const platformHeight = 10;
let platformX = (canvas.width - platformWidth) / 2;
let platformSpeed = 7;

const ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - platformHeight - ballRadius;
let ballSpeedX = 5;
let ballSpeedY = -5;

const brickRowCount = 5;
const brickColumnCount = 8;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let score = 0;
let lives = 3;

const brickColors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"];

const bricks = Array.from({ length: brickColumnCount }, (_, col) =>
  Array.from({ length: brickRowCount }, (_, row) => ({
    x: col * (brickWidth + brickPadding) + brickOffsetLeft,
    y: row * (brickHeight + brickPadding) + brickOffsetTop,
    status: 1,
    color: brickColors[row]
  }))
);

let particles = [];
let keys = {};

document.addEventListener("mousemove", (event) => {
  if (gameState !== "playing") return;
  const rect = canvas.getBoundingClientRect();
  platformX = event.clientX - rect.left - platformWidth / 2;
  if (platformX < 0) platformX = 0;
  if (platformX + platformWidth > canvas.width) platformX = canvas.width - platformWidth;
});

document.addEventListener("keydown", (event) => {
  keys[event.code] = true;
});

document.addEventListener("keyup", (event) => {
  keys[event.code] = false;
});

function createParticles(x, y, color) {
  for (let i = 0; i < 5; i++) {
    particles.push({
      x: x + Math.random() * brickWidth,
      y: y + Math.random() * brickHeight,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 30,
      color: color
    });
  }
}

function updateParticles() {
  particles = particles.filter(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    return p.life > 0;
  });
}

function drawParticles() {
  particles.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life / 30;
    ctx.fillRect(p.x, p.y, 2, 2);
  });
  ctx.globalAlpha = 1;
}

function drawBricks() {
  bricks.forEach((col) => {
    col.forEach((brick) => {
      if (brick.status === 1) {
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brickWidth, brickHeight);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.strokeRect(brick.x, brick.y, brickWidth, brickHeight);
      }
    });
  });
}

function collisionDetection() {
  bricks.forEach((col) => {
    col.forEach((brick) => {
      if (brick.status === 1) {
        if (
          ballX > brick.x &&
          ballX < brick.x + brickWidth &&
          ballY > brick.y &&
          ballY < brick.y + brickHeight
        ) {
          ballSpeedY = -ballSpeedY;
          brick.status = 0;
          score += 10;
          scoreElement.textContent = score;
          createParticles(brick.x, brick.y, brick.color);
        }
      }
    });
  });
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#FFD700";
  ctx.fill();
  ctx.strokeStyle = "#FFA500";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawPlatform() {
  ctx.fillStyle = "#FF4500";
  ctx.fillRect(
    platformX,
    canvas.height - platformHeight,
    platformWidth,
    platformHeight
  );
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.strokeRect(
    platformX,
    canvas.height - platformHeight,
    platformWidth,
    platformHeight
  );
}

function startGame() {
  gameState = "playing";
  startScreenElement.style.display = "none";
  resetBall();
  resetBricks();
  draw();
}

function gameOver() {
  gameState = "gameOver";
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("arkanoidHighScore", highScore);
    highScoreElement.textContent = highScore;
  }
  gameOverElement.style.display = "block";
  finalScoreElement.textContent = score;
}

function restartGame() {
  score = 0;
  lives = 3;
  scoreElement.textContent = score;
  livesElement.textContent = lives;
  gameOverElement.style.display = "none";
  gameState = "playing";
  resetBall();
  resetBricks();
  draw();
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height - platformHeight - ballRadius;
  ballSpeedX = 5;
  ballSpeedY = -5;
  platformX = (canvas.width - platformWidth) / 2;
}

function resetBricks() {
  bricks.forEach((col) => {
    col.forEach((brick) => {
      brick.status = 1;
    });
  });
  particles = [];
}

function draw() {
  if (gameState !== "playing") return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPlatform();
  updateParticles();
  drawParticles();

  // Keyboard controls
  if (keys["ArrowLeft"] && platformX > 0) {
    platformX -= platformSpeed;
  }
  if (keys["ArrowRight"] && platformX + platformWidth < canvas.width) {
    platformX += platformSpeed;
  }

  if (
    ballX + ballSpeedX > canvas.width - ballRadius ||
    ballX + ballSpeedX < ballRadius
  ) {
    ballSpeedX = -ballSpeedX;
  }
  if (ballY + ballSpeedY < ballRadius) {
    ballSpeedY = -ballSpeedY;
  } else if (
    ballY + ballSpeedY >
    canvas.height - ballRadius - platformHeight
  ) {
    if (ballX > platformX && ballX < platformX + platformWidth) {
      ballSpeedY = -ballSpeedY;
    } else {
      lives--;
      livesElement.textContent = lives;
      if (lives <= 0) {
        gameOver();
        return;
      } else {
        resetBall();
      }
    }
  }

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  collisionDetection();

  requestAnimationFrame(draw);
}
