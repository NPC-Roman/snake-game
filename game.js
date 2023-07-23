document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector(".game-canvas");
  const ctx = canvas.getContext("2d");
  const gameStartBtn = document.querySelector(".game-start");
  const gameResetBtn = document.querySelector(".game-reset");
  const gameScore = document.querySelector(".game-score");
  const snakeImg = new Image();
  const foodImg = new Image();
  snakeImg.src = "/img/snake.png";
  foodImg.src = "/img/cherry.png";

  const cellSize = 20;
  const canvasSize = canvas.width / cellSize;
  let snake = [{ x: 10, y: 10 }];
  let food = { x: 5, y: 5 };
  let score = 0;
  let dx = 1;
  let dy = 0;
  let isGameRunning = false;
  let gameOver = false;
  let speed = 400; // Початкова швидкість руху
  const acceleration = 1; // Швидкість збільшення руху

  const drawSnake = () => {
    snake.forEach((segment) => {
      ctx.drawImage(
        snakeImg,
        segment.x * cellSize,
        segment.y * cellSize,
        cellSize,
        cellSize
      );
    });
  };

  const drawFood = () => {
    ctx.drawImage(
      foodImg,
      food.x * cellSize,
      food.y * cellSize,
      cellSize,
      cellSize
    );
  };

  const moveSnake = () => {
    if (gameOver) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score++;
      gameScore.textContent = `Очки: ${score}`;
      generateFood();
      speedUp();
    } else {
      snake.pop();
    }

    if (isCollision()) {
      gameOver = true;
      gameScore.textContent = `Гра закінчена! Очки: ${score}`;
    }
  };

  const generateFood = () => {
    food = {
      x: Math.floor(Math.random() * canvasSize),
      y: Math.floor(Math.random() * canvasSize),
    };
  };

  const isCollision = () => {
    const head = snake[0];
    return (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= canvasSize ||
      head.y >= canvasSize ||
      snake
        .slice(1)
        .some((segment) => segment.x === head.x && segment.y === head.y)
    );
  };

  const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const gameLoop = () => {
    if (!isGameRunning) return;

    clearCanvas();
    drawFood();
    drawSnake();
    moveSnake();

    setTimeout(gameLoop, speed);
  };

  const speedUp = () => {
    speed -= acceleration;
    if (speed <= 0) {
      speed = 1; // Мінімальна швидкість
    }
  };

  const startGame = () => {
    snake = [{ x: 10, y: 10 }];
    dx = 1;
    dy = 0;
    score = 0;
    gameOver = false;
    gameScore.textContent = "Очки: 0";
    generateFood();
    isGameRunning = true;
    gameLoop();
  };

  const resetGame = () => {
    isGameRunning = false;
    startGame();
  };

  gameStartBtn.addEventListener("click", startGame);
  gameResetBtn.addEventListener("click", resetGame);

  document.addEventListener("keydown", (event) => {
    const keyPressed = event.key;
    if (keyPressed === "ArrowUp" && dy === 0) {
      dx = 0;
      dy = -1;
    } else if (keyPressed === "ArrowDown" && dy === 0) {
      dx = 0;
      dy = 1;
    } else if (keyPressed === "ArrowLeft" && dx === 0) {
      dx = -1;
      dy = 0;
    } else if (keyPressed === "ArrowRight" && dx === 0) {
      dx = 1;
      dy = 0;
    }
  });
});
