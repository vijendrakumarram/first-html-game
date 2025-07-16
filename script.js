const tank = document.getElementById("tank");
const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");

let score = 0;
let tankX = gameArea.clientWidth / 2 - 20;
tank.style.left = `${tankX}px`;

// Clamp and move tank
function moveTank(direction) {
  const speed = 5;
  const gameWidth = gameArea.clientWidth;
  const tankWidth = tank.offsetWidth;

  if (direction === "left") {
    tankX = Math.max(0, tankX - speed);
  } else if (direction === "right") {
    tankX = Math.min(gameWidth - tankWidth, tankX + speed);
  }

  tank.style.left = `${tankX}px`;
}

// Fire bullet from center
function fireBullet() {
  const bullet = document.createElement("div");
  bullet.classList.add("bullet");

  const bulletX = tank.offsetLeft + (tank.offsetWidth / 2) - (5 / 2); // center
  const bulletY = tank.offsetTop;

  bullet.style.left = `${bulletX}px`;
  bullet.style.top = `${bulletY}px`;

  gameArea.appendChild(bullet);

  checkCollision(bullet);

  const interval = setInterval(() => {
    let y = parseInt(bullet.style.top);
    if (y < 0) {
      clearInterval(interval);
      bullet.remove();
    } else {
      bullet.style.top = `${y - 10}px`;
    }
  }, 30);
}

// Check if bullet hits enemy
function checkCollision(bullet) {
  const collisionInterval = setInterval(() => {
    const enemies = document.querySelectorAll(".enemy");

    enemies.forEach((enemy) => {
      const bulletRect = bullet.getBoundingClientRect();
      const enemyRect = enemy.getBoundingClientRect();

      const overlap = !(
        bulletRect.bottom < enemyRect.top ||
        bulletRect.top > enemyRect.bottom ||
        bulletRect.right < enemyRect.left ||
        bulletRect.left > enemyRect.right
      );

      if (overlap) {
        bullet.remove();
        enemy.remove();
        clearInterval(collisionInterval);
        score++;
        scoreDisplay.textContent = score;
      }
    });

    if (!document.body.contains(bullet)) {
      clearInterval(collisionInterval);
    }
  }, 30);
}

// Spawn enemy from top
function spawnEnemy() {
  const enemy = document.createElement("div");
  enemy.classList.add("enemy");

  const enemyX = Math.floor(Math.random() * (gameArea.clientWidth - 30));
  enemy.style.left = `${enemyX}px`;
  enemy.style.top = "0px";

  gameArea.appendChild(enemy);

  const fallInterval = setInterval(() => {
    let y = parseInt(enemy.style.top);
    if (y > gameArea.clientHeight) {
      clearInterval(fallInterval);
      enemy.remove();
    } else {
      enemy.style.top = `${y + 4}px`;
    }
  }, 40);
}

// Mobile touch controls — continuous movement
let moveLeftInterval, moveRightInterval;

document.getElementById("left-btn").addEventListener("touchstart", () => {
  moveLeftInterval = setInterval(() => moveTank("left"), 20);
});
document.getElementById("left-btn").addEventListener("touchend", () => {
  clearInterval(moveLeftInterval);
});

document.getElementById("right-btn").addEventListener("touchstart", () => {
  moveRightInterval = setInterval(() => moveTank("right"), 20);
});
document.getElementById("right-btn").addEventListener("touchend", () => {
  clearInterval(moveRightInterval);
});

// Tap to fire
document.getElementById("fire-btn").addEventListener("touchstart", fireBullet);

// Keyboard controls (optional for desktop)
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") moveTank("left");
  if (e.key === "ArrowRight") moveTank("right");
  if (e.code === "Space") fireBullet();
});

// Start enemy spawn loop
setInterval(spawnEnemy, 1500);
