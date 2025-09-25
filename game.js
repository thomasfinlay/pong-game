const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const PADDLE_MARGIN = 20;
const BALL_SIZE = 16;
const BALL_SPEED = 6;
const AI_SPEED = 4;

let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballSpeedX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = BALL_SPEED * (Math.random() * 2 - 1);

function drawRect(x, y, w, h, color = '#fff') {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color = '#fff') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
    ctx.fill();
}

// Mouse control for player paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    playerY = e.clientY - rect.top - PADDLE_HEIGHT / 2;
    // Clamp paddle within bounds
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

// Main game loop
function gameLoop() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Wall collision (top/bottom)
    if (ballY <= 0) {
        ballY = 0;
        ballSpeedY = -ballSpeedY;
    }
    if (ballY + BALL_SIZE >= canvas.height) {
        ballY = canvas.height - BALL_SIZE;
        ballSpeedY = -ballSpeedY;
    }

    // Player paddle collision
    if (
        ballX <= PADDLE_MARGIN + PADDLE_WIDTH &&
        ballY + BALL_SIZE >= playerY &&
        ballY <= playerY + PADDLE_HEIGHT
    ) {
        ballX = PADDLE_MARGIN + PADDLE_WIDTH;
        ballSpeedX = -ballSpeedX;
        // Add some "spin"
        ballSpeedY += ((ballY + BALL_SIZE/2) - (playerY + PADDLE_HEIGHT/2)) * 0.15;
    }

    // AI paddle collision
    if (
        ballX + BALL_SIZE >= canvas.width - PADDLE_MARGIN - PADDLE_WIDTH &&
        ballY + BALL_SIZE >= aiY &&
        ballY <= aiY + PADDLE_HEIGHT
    ) {
        ballX = canvas.width - PADDLE_MARGIN - PADDLE_WIDTH - BALL_SIZE;
        ballSpeedX = -ballSpeedX;
        // Add some "spin"
        ballSpeedY += ((ballY + BALL_SIZE/2) - (aiY + PADDLE_HEIGHT/2)) * 0.15;
    }

    // Score reset (ball leaves left or right)
    if (ballX < 0 || ballX > canvas.width) {
        // Reset ball to center
        ballX = canvas.width / 2 - BALL_SIZE / 2;
        ballY = canvas.height / 2 - BALL_SIZE / 2;
        ballSpeedX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
        ballSpeedY = BALL_SPEED * (Math.random() * 2 - 1);
    }

    // AI paddle movement
    const aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY + BALL_SIZE / 2 - 10) {
        aiY += AI_SPEED;
    } else if (aiCenter > ballY + BALL_SIZE / 2 + 10) {
        aiY -= AI_SPEED;
    }
    // Clamp AI paddle within bounds
    if (aiY < 0) aiY = 0;
    if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;

    // Drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    drawRect(PADDLE_MARGIN, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, '#4af');
    drawRect(canvas.width - PADDLE_MARGIN - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, '#fa4');

    // Draw ball
    drawBall(ballX, ballY, BALL_SIZE);

    // Draw net
    for (let i = 10; i < canvas.height; i += 40) {
        drawRect(canvas.width / 2 - 2, i, 4, 20, '#888');
    }

    // Loop
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();