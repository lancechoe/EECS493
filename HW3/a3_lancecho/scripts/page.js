// ============== Winter 2024 EECS 493 Assignment 2 Starter Code ==============

// Main
$(document).ready(function () {
  // ====== Startup ======
  // TODO: DEFINE YOUR JQUERY SELECTORS HERE

  var slider = document.getElementById("myRange");
  var output = document.getElementById("demo");
  output.innerHTML = slider.value;

  slider.oninput = function () {
    output.innerHTML = this.value;
  };

  var difficultyButtons = $(".difficulty-button");

  difficultyButtons.click(function () {
    // Remove 'selected' class from all buttons
    difficultyButtons.removeClass("selected");

    // Add 'selected' class to the clicked button
    $(this).addClass("selected");
  });
});

var difficulty_level = "normal";
var asteroidSpawnInterval;
var shieldSpawnInterval;
var portSpawnInterval;
var scoreUpdateInterval;
var collisionInterval;
let gameActive = true;
var isshielded = false;
var speed = 9000;

// TODO: ADD YOUR EVENT HANDLERS HERE
function togglePopup() {
  var flexoverlay = document.getElementById("setting-popup");
  flexoverlay.style.display =
    flexoverlay.style.display == "flex" ? "none" : "flex";
}

function tutorialPopup() {
  var tutorialoverlay = document.getElementById("tutorial");
  tutorialoverlay.style.display =
    tutorialoverlay.style.display == "flex" ? "none" : "flex";
}

function gamePopup() {
  gameActive = true;
  var gameoverlay = document.getElementById("game");
  var readyoverlay = document.getElementById("flashScreen");
  readyoverlay.style.opacity = "1";

  gameoverlay.style.display =
    gameoverlay.style.display == "flex" ? "none" : "flex";
  readyoverlay.style.display =
    readyoverlay.style.display == "flex" ? "none" : "flex";

  resetScoreboard();

  setTimeout(function () {
    readyoverlay.style.opacity = "0";
    startSpawningAsteroids();
    startSpawningPorts();
    startSpawningShields();
    increaseScoreAndDanger();
    collisionInterval = setInterval(function () {
      checkCollision();
    }, 1);
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  if (!gameActive) return;
  const player = document.getElementById("player");
  let playerX = 50; // Initial X position (%)
  let playerY = 50; // Initial Y position (%)
  let dx = 0;
  let dy = 0;
  const speed = 1; // Adjust speed as needed

  // Set initial player position
  player.style.left = `${playerX}%`;
  player.style.top = `${playerY}%`;

  function updatePlayerPosition() {
    playerX += dx;
    playerY += dy;

    // Ensure player stays within the game container
    playerX = Math.max(Math.min(playerX, 100), 0);
    playerY = Math.max(Math.min(playerY, 100), 0);

    // Update player position
    player.style.left = `${playerX}%`;
    player.style.top = `${playerY}%`;

    // Update player image based on movement direction
    updatePlayerImage();

    requestAnimationFrame(updatePlayerPosition);
  }

  function updatePlayerImage() {
    if (!gameActive) return;

    if (!isshielded) {
      if (dx > 0) {
        player.src = "src/player/player_right.gif";
      } else if (dx < 0) {
        player.src = "src/player/player_left.gif";
      } else if (dy > 0) {
        player.src = "src/player/player_down.gif";
      } else if (dy < 0) {
        player.src = "src/player/player_up.gif";
      } else if (dx == 0 && dy == 0) {
        player.src = "src/player/player.gif";
      }
    }

    if (isshielded) {
      if (dx > 0) {
        player.src = "src/player/player_shielded_right.gif";
      } else if (dx < 0) {
        player.src = "src/player/player_shielded_left.gif";
      } else if (dy > 0) {
        player.src = "src/player/player_shielded_down.gif";
      } else if (dy < 0) {
        player.src = "src/player/player_shielded_up.gif";
      } else if (dx == 0 && dy == 0) {
        player.src = "src/player/player_shielded.gif";
      }
    }
  }

  updatePlayerPosition();

  document.addEventListener("keydown", (event) => {
    if (!gameActive) return;
    switch (event.key) {
      case "ArrowUp":
        dy = -speed;
        break;
      case "ArrowDown":
        dy = speed;
        break;
      case "ArrowLeft":
        dx = -speed;
        break;
      case "ArrowRight":
        dx = speed;
        break;
    }
  });

  document.addEventListener("keyup", (event) => {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown":
        dy = 0;
        break;
      case "ArrowLeft":
      case "ArrowRight":
        dx = 0;
        break;
    }
  });
});

function difficulty(diff) {
  difficulty_level = diff;
}

function startSpawningAsteroids() {
  // Set the spawn rate
  var spawnRate; // milliseconds

  switch (difficulty_level) {
    case "easy":
      spawnRate = 1000;
      break;
    case "normal":
      spawnRate = 800;
      break;
    case "hard":
      spawnRate = 600;
      break;
    default:
      spawnRate = 800;
      break;
  }

  // Start spawning asteroids at the specified interval
  asteroidSpawnInterval = setInterval(spawnAsteroid, spawnRate);
}

function spawnAsteroid() {
  // Create a new asteroid element
  var asteroid = $("<img>", {
    class: "asteroid",
    src: "src/asteroid.png",
    style: "height: 62px; width: 62px",
  });

  // Determine which side to spawn the asteroid (top, bottom, left, or right)
  var side = Math.floor(Math.random() * 4); // 0: top, 1: bottom, 2: left, 3: right

  // Calculate random position based on the side
  var xPos, yPos;

  switch (side) {
    case 0: // Top side
      xPos = Math.floor(Math.random() * 1280); // Random X position
      yPos = -62; // Adjust for asteroid height
      break;
    case 1: // Bottom side
      xPos = Math.floor(Math.random() * 1280); // Random X position
      yPos = 720; // Adjust for game window height
      break;
    case 2: // Left side
      xPos = -62; // Adjust for asteroid width
      yPos = Math.floor(Math.random() * 720); // Random Y position
      break;
    case 3: // Right side
      xPos = 1280; // Adjust for game window width
      yPos = Math.floor(Math.random() * 720); // Random Y position
      break;
  }

  // Set initial position
  asteroid.css({ top: yPos + "px", left: xPos + "px" });

  // Append asteroid to game window
  $(".game-background").append(asteroid);

  // Determine the target position (opposite side)
  var targetX, targetY;

  switch (side) {
    case 0: // Top side
      targetX = Math.floor(Math.random() * 1280);
      targetY = 720; // Bottom side
      break;
    case 1: // Bottom side
      targetX = Math.floor(Math.random() * 1280);
      targetY = -62; // Top side
      break;
    case 2: // Left side
      targetX = 1280; // Right side
      targetY = Math.floor(Math.random() * 720);
      break;
    case 3: // Right side
      targetX = -62; // Left side
      targetY = Math.floor(Math.random() * 720);
      break;
  }

  switch (difficulty_level) {
    case "easy":
      speed = 9000;
      break;
    case "normal":
      speed = 3000;
      break;
    case "hard":
      speed = 1400;
      break;
    default:
      speed = 3000;
      break;
  }

  // Animate asteroid movement towards the target position
  asteroid.animate(
    { top: targetY + "px", left: targetX + "px" }, // Move asteroid to the target position
    {
      duration: speed, // Adjust speed as needed
      easing: "linear",
      complete: function () {
        // Remove asteroid when animation is complete
        $(this).remove();
      },
    }
  );
}

function startSpawningShields() {
  shieldSpawnInterval = setInterval(spawnShield, 10000);
}

function spawnShield() {
  // Create a new shield element
  var shield = $("<img>", {
    class: "shield",
    src: "src/shield.gif",
    style: "height: 80px; width: 80px",
  });

  // Calculate random position based on the side
  var xPos, yPos;
  xPos = Math.floor(Math.random() * 1280);
  yPos = Math.floor(Math.random() * 720);

  // Set initial position
  shield.css({ top: yPos + "px", left: xPos + "px" });

  // Append asteroid to game window
  $(".game-background").append(shield);

  setTimeout(function () {
    shield.remove();
  }, 5000);
}

function startSpawningPorts() {
  portSpawnInterval = setInterval(spawnPort, 15000);
}

function spawnPort() {
  // Create a new shield element
  var port = $("<img>", {
    class: "port",
    src: "src/port.gif",
    style: "height: 80px; width: 80px",
  });

  // Calculate random position based on the side
  var xPos, yPos;
  xPos = Math.floor(Math.random() * 1280);
  yPos = Math.floor(Math.random() * 720);

  // Set initial position
  port.css({ top: yPos + "px", left: xPos + "px" });

  // Append asteroid to game window
  $(".game-background").append(port);

  setTimeout(function () {
    port.remove();
  }, 5000);
}

var score = 0;
var danger = 0;
var level = 1;
var difficultySettings = {
  easy: { danger: 10 },
  normal: { danger: 20 },
  hard: { danger: 30 },
};
danger = difficultySettings[difficulty_level].danger;

// Function to update scoreboard
function updateScoreboard() {
  $("#score").text(score);
  $("#danger").text(danger);
  $("#level").text(level);
  $("#finalscore").text(score);
}

// Function to reset scoreboard values based on difficulty
function resetScoreboard() {
  danger = difficultySettings[difficulty_level].danger;
  score = 0;
  level = 1;
  updateScoreboard();
}

function increaseScoreAndDanger() {
  scoreUpdateInterval = setInterval(function () {
    score += 40;
    updateScoreboard();
  }, 500);
}

/* --------------------- Additional Utility Functions  --------------------- */
// Are two elements currently colliding?
function isColliding(o1, o2) {
  return isOrWillCollide(o1, o2, 0, 0);
}

// Will two elements collide soon?
// Input: Two elements, upcoming change in position for the moving element
function willCollide(o1, o2, o1_xChange, o1_yChange) {
  return isOrWillCollide(o1, o2, o1_xChange, o1_yChange);
}

// Are two elements colliding or will they collide soon?
// Input: Two elements, upcoming change in position for the moving element
// Use example: isOrWillCollide(paradeFloat2, person, FLOAT_SPEED, 0)
function isOrWillCollide(o1, o2, o1_xChange, o1_yChange) {
  const o1D = {
    left: o1.offset().left + o1_xChange,
    right: o1.offset().left + o1.width() + o1_xChange,
    top: o1.offset().top + o1_yChange,
    bottom: o1.offset().top + o1.height() + o1_yChange,
  };
  const o2D = {
    left: o2.offset().left,
    right: o2.offset().left + o2.width(),
    top: o2.offset().top,
    bottom: o2.offset().top + o2.height(),
  };
  // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  if (
    o1D.left < o2D.right &&
    o1D.right > o2D.left &&
    o1D.top < o2D.bottom &&
    o1D.bottom > o2D.top
  ) {
    // collision detected!
    return true;
  }
  return false;
}

// Function to check for collision between player and asteroids
function checkCollision() {
  const playerElement = $("#player");
  const asteroids = $(".asteroid");
  const shield = $(".shield");
  const port = $(".port");

  asteroids.each(function () {
    if (
      isColliding(playerElement, $(this)) ||
      willCollide(playerElement, $(this))
    ) {
      if (!isshielded) {
        // Collision detected
        playerElement.attr("src", "src/player/player_touched.gif");
        $(".asteroid").stop();
        playDieSound();
        gameActive = false;
        endGame();
        setTimeout(() => {
          gameoverPopup();
          $(".asteroid").remove();
        }, 2000);

        return false; // Exit the loop
      }
      if (isshielded) {
        $(this).remove();
        isshielded = false;
      }
    }
  });

  shield.each(function () {
    if (
      isColliding(playerElement, $(this)) ||
      willCollide(playerElement, $(this))
    ) {
      playerElement.attr("src", "src/player/player_shielded.gif");
      playCollectSound();
      $(this).remove();
      isshielded = true;
    }
  });

  port.each(function () {
    if (
      isColliding(playerElement, $(this)) ||
      willCollide(playerElement, $(this))
    ) {
      $(this).remove();
      playCollectSound();
      speed += 500;
      danger += 2;
      level += 1;
    }
  });
}

function endGame() {
  clearInterval(asteroidSpawnInterval);
  clearInterval(shieldSpawnInterval);
  clearInterval(portSpawnInterval);
  clearInterval(scoreUpdateInterval);
  clearInterval(collisionInterval);
}

function gameoverPopup() {
  var gameoveroverlay = document.getElementById("gameover");
  gameoveroverlay.style.display =
    gameoveroverlay.style.display == "flex" ? "none" : "flex";
}

function restartGame() {
  var gameoverlay = document.getElementById("game");
  var readyoverlay = document.getElementById("flashScreen");
  var gameoveroverlay = document.getElementById("gameover");
  var tutorialoverlay = document.getElementById("tutorial");

  gameoverlay.style.display =
    gameoverlay.style.display == "none" ? "flex" : "none";
  gameoveroverlay.style.display =
    gameoveroverlay.style.display == "none" ? "flex" : "none";
  readyoverlay.style.display =
    readyoverlay.style.display == "none" ? "flex" : "none";
  tutorialoverlay.style.display =
    tutorialoverlay.style.display == "none" ? "flex" : "none";

  resetScoreboard();
}

function playDieSound() {
  var dieSound = document.getElementById("dieSound");
  var myVolume = document.getElementById("myRange");
  dieSound.volume = myVolume.value / 100;
  dieSound.play();
}

function playCollectSound() {
  var collectSound = document.getElementById("collectSound");
  var myVolume = document.getElementById("myRange");
  collectSound.volume = myVolume.value / 100;
  collectSound.play();
}
