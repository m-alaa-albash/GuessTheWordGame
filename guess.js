// Setting Game Name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Created By 3laa`;
// Setting Game Option
let numbersOfTries = 6;
let numbersOfLetter = 6;
let currentTry = 1;
let numbersOfHints = 2;

// Manage Words
let wordToGuess = "";
const words = ["Winter", "Planet", "Travel", "Garden", "Friend", "Family", "Animal", "School", "Forest", "Silver", "Castle", "Sunset", "Flower", "Orange", "Market"];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let messageArea = document.querySelector(".message");

// Manage Hints
document.querySelector(".hint span").innerHTML = numbersOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);

function generateInputs() {
  const inputsContainer = document.querySelector(".inputs");
  for (let i = 1; i <= numbersOfTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}</span>`;
    if (i !== 1) tryDiv.classList.add("disabled-input");
    for (let j = 1; j <= numbersOfLetter; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.setAttribute("maxlength", "1");
      tryDiv.appendChild(input)
    }
    inputsContainer.appendChild(tryDiv);
  }
  inputsContainer.children[0].children[1].focus();
  const inputInDisableDiv = document.querySelectorAll(".disabled-input input");
  inputInDisableDiv.forEach((input) => input.disabled = true);
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      if (input.value) {
        input.value = input.value.toUpperCase();
        const nextInput = inputs[index + 1];
        if (nextInput) nextInput.focus();
      }
    });
    input.addEventListener("keydown", function (event) {
      const currentIndex = Array.from(inputs).indexOf(event.target);
      if (event.key === "ArrowRight") {
        const nextInput = currentIndex + 1;
        if (nextInput < inputs.length) inputs[nextInput].focus();
      }
      if (event.key === "ArrowLeft") {
        const prevInput = currentIndex - 1;
        if (prevInput >= 0) inputs[prevInput].focus();
      }
    });
  });
}

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);

function handleGuesses() {
  let successGuess = true;
  for (let i = 1; i <= numbersOfLetter; i++) {
    const inputFeild = document.querySelector(`#guess-${currentTry}-letter-${i}`);
    const letter = inputFeild.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1];
    // Game Logic
    if (letter === actualLetter) {
      inputFeild.classList.add("yes-in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      inputFeild.classList.add("not-in-place");
      successGuess = false;
    } else {
      inputFeild.classList.add("no");
      successGuess = false;
    }
  }
  if (successGuess) {
    messageArea.innerHTML = `You Win The Word Is <span>${wordToGuess}</span>`;
    if (numbersOfHints === 2) {
      messageArea.innerHTML = `<p>congratz You Didn't Use Hints</p>`;
    }
    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-input"));
    guessButton.disabled = true;
    getHintButton.disabled = true;
  } else {
    document.querySelector(`.try-${currentTry}`).classList.add("disabled-input");
    const currentTruInput = document.querySelectorAll(`.try-${currentTry} input`);
    currentTruInput.forEach((input) => input.disabled = true);
    currentTry++;
    const nextCurrentTry = document.querySelectorAll(`.try-${currentTry} input`);
    nextCurrentTry.forEach((input) => input.disabled = false);
    let el = document.querySelector(`.try-${currentTry}`);
    if (el) {
      document.querySelector(`.try-${currentTry}`).classList.remove("disabled-input");
      el.children[1].focus();
    } else {
      guessButton.disabled = true;
      getHintButton.disabled = true;
      messageArea.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`;
    }
  }
}

function getHint() {
  if (numbersOfHints > 0) {
    numbersOfHints--;
    document.querySelector(".hint span").innerHTML = numbersOfHints;
  }
  if (numbersOfHints === 0) {
    getHintButton.disabled = true;
  }
  const enabledInputs = document.querySelectorAll("input:not([disabled])");
  const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === "");
  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    const randomInput = emptyEnabledInputs[randomIndex];
    const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
    if (indexToFill !== -1) {
      randomInput.value = wordToGuess[indexToFill].toUpperCase();
    }
  }
}

function handleBackspace(event) {
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])");
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);
    if (currentIndex > 0) {
      const currentInput = inputs[currentIndex];
      const prevInput = inputs[currentIndex - 1];
      currentInput.value = "";
      prevInput.focus();
    }
  }
}

document.addEventListener("keydown", handleBackspace);

window.onload = function () {
  generateInputs();
};