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
