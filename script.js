let score = 0;
const box = document.getElementById("box");
const scoreDisplay = document.getElementById("score");
const container = document.getElementById("game-container");

// Load sound
const clickSound = new Audio("click.wav");

function moveBox() {
  const maxX = container.clientWidth - box.clientWidth;
  const maxY = container.clientHeight - box.clientHeight;

  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  box.style.left = `${randomX}px`;
  box.style.top = `${randomY}px`;
}

function handleClick() {
  clickSound.play();
  score++;
  scoreDisplay.textContent = score;
  moveBox();

  if (score >= 10) {
    setTimeout(() => {
      alert("🎉 You Win!");
      score = 0;
      scoreDisplay.textContent = score;
      moveBox();
    }, 100);
  }
}

// Mouse click
box.addEventListener("click", handleClick);

// Touch (mobile)
box.addEventListener("touchstart", (e) => {
  e.preventDefault(); // Avoid double trigger
  handleClick();
});

moveBox(); // Initial placement
