const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tryAgainButton = document.getElementById("tryAgain");
const playButton = document.getElementById("playButton");
const gameContainer = document.querySelector(".game-container");
const welcomeScreen = document.querySelector(".welcome-screen");
const scoreDisplay = document.getElementById("score");

// ✅ Sound Effects (Restored)
const eatSound = new Audio("sounds/eat.mp3");
const gameOverSound = new Audio("sounds/gameover.mp3");
const buttonClickSound = new Audio("sounds/button.mp3");

canvas.width = 480;
canvas.height = 480;
const gridSize = 40;

let snake, direction, food, score, gameOver, speed, gameRunning, gameLoopInterval;

// ✅ Start Game Function
function startGame() {
    buttonClickSound.play();
    welcomeScreen.style.display = "none";
    gameContainer.style.display = "block";

    snake = [{ x: 200, y: 200 }];
    direction = { x: gridSize, y: 0 };
    food = generateFood();
    score = 0;
    scoreDisplay.textContent = score;
    gameOver = false;
    speed = 200;
    gameRunning = true;

    tryAgainButton.style.display = "none";
    clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameLoop, speed);
}

// ✅ Generate Food
function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
    };
}

// ✅ Draw Everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = "#555";
    for (let i = 0; i < canvas.width; i += gridSize) {
        for (let j = 0; j < canvas.height; j += gridSize) {
            ctx.strokeRect(i, j, gridSize, gridSize);
        }
    }

    // Food (Always Red)
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    // Snake (Always Green)
    snake.forEach((segment, index) => {
        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
        ctx.strokeStyle = "black";
        ctx.strokeRect(segment.x, segment.y, gridSize, gridSize);

        // Snake Eyes
        if (index === 0) {
            ctx.fillStyle = "white";
            ctx.fillRect(segment.x + 8, segment.y + 8, 6, 6);
            ctx.fillRect(segment.x + 24, segment.y + 8, 6, 6);
        }
    });
}

// ✅ Collision Check
function checkCollision() {
    let head = snake[0];
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) return true;
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) return true;
    }
    return false;
}

// ✅ Update Game Logic
function update() {
    if (gameOver) return;

    let newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (checkCollision()) {
        gameOverSound.play();
        gameOver = true;
        tryAgainButton.style.display = "block";
        return;
    }

    snake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
        eatSound.play();
        score++;
        scoreDisplay.textContent = score;
        speed *= 0.95;
        clearInterval(gameLoopInterval);
        gameLoopInterval = setInterval(gameLoop, speed);
        food = generateFood();
    } else {
        snake.pop();
    }
}

// ✅ Game Loop
function gameLoop() {
    if (!gameOver && gameRunning) {
        update();
        draw();
    }
}

// ✅ Button Events
playButton.addEventListener("click", startGame);
tryAgainButton.addEventListener("click", startGame);
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -gridSize };
    else if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: gridSize };
    else if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -gridSize, y: 0 };
    else if (e.key === "ArrowRight" && direction.x === 0) direction = { x: gridSize, y: 0 };
});
