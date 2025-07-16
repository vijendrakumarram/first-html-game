const tank = document.getElementById("tank");
const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");

let score = 0;

// Initial tank position (centered)
let tankX = gameArea.clientWidth / 2 - 20;
tank.style.left = `${tankX}px`;

// Move tank
function moveTank(direction) {
  const speed = 10;
  if (direction === "left" && tankX > 0) {
    tankX -= speed;
  }
  if (direction === "right" && tankX < gameArea.clientWidth - tank.offsetWidth) {
    tankX += speed;
  }
  tank.style.left = `${tankX}px`;
}

// Fire bullet
function fireBullet() {
  const bullet = document.createElement("div");
  bullet.classList.add("bullet");

  const bulletX = tank.offsetLeft + (tank.offsetWidth / 2) - (5 / 2); // 5 = bullet width
  const bulletY = tank.offsetTop;

  bullet.style.left = `${bulletX}px`;
  bullet.style.top = `${bulletY}px`;

  gameArea.appendChild(bullet);

  checkCollision(bullet); // Start collision check

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

// Check bullet collision with enemies
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

// Spawn enemies
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

// Touch button listeners
document.getElementById("left-btn").addEventListener("touchstart", () => moveTank("left"));
document.getElementById("right-btn").addEventListener("touchstart", () => moveTank("right"));
document.getElementById("fire-btn").addEventListener("touchstart", fireBullet);

// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") moveTank("left");
  if (e.key === "ArrowRight") moveTank("right");
  if (e.code === "Space") fireBullet();
});

// Start enemy spawn loop
setInterval(spawnEnemy, 1500);
