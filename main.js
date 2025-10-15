// setting game name
let gameName = " Guess the word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector(
  "footer"
).innerHTML = `${gameName} game created by ENG. Dina Elbry`;

// setting game options

let numOfTries = 6;
let numOfLetters = 6;
let currentTry = 1;
let numOfHints = 2;

//manage words
let wordToGuess = "";
const words = [
  "lovely",
  "pretty",
  "unreal",
  "follow",
  "bravoo",
  "dandon",
  "strong",
  "puzzle",
  "banana",
  "planet",
  "winter",
  "wonder",
  "energy",
  "leader",
  "accept",
  "reflect",
  "candle",
  "island",
  "jacket",
  "orange",
  "kitten",
];
wordToGuess = words[Math.floor(Math.random() * words.length)].toUpperCase();
// console.log(wordToGuess);
let messageArea = document.querySelector(".message");

// manage hints
document.querySelector(".hint span").innerHTML = numOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);

// function generate inputs
function geneateInput() {
  const inputsContainer = document.querySelector(".inputs");
  // create main try div
  for (let i = 1; i <= numOfTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}</span>`;
    // disabled
    if (i !== 1) tryDiv.classList.add("disabled-inputs");

    // create inputs
    for (let j = 1; j <= numOfLetters; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.maxLength = 1;
      tryDiv.appendChild(input);
    }

    inputsContainer.appendChild(tryDiv);
  }
  inputsContainer.children[0].children[1].focus();
  // disabled all inputs except first try
  const inputsInDisabledDiv = document.querySelectorAll(
    ".disabled-inputs input"
  );
  inputsInDisabledDiv.forEach((input) => (input.disabled = true));

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    // convert to UpperCase
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      const nextInput = inputs[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    });

    input.addEventListener("keydown", function (event) {
      // console.log(event)
      const currentIndex = Array.from(inputs).indexOf(event.target); // can use this rather than event.target
      // console.log(currentIndex)
      if (event.key === "ArrowRight") {
        const nextInput = currentIndex + 1;
        if (nextInput < inputs.length) {
          inputs[nextInput].focus();
        }
      }
      if (event.key === "ArrowLeft") {
        const leftInput = currentIndex - 1;
        if (leftInput >= 0) {
          inputs[leftInput].focus();
        }
      }
    });
  });
}

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);

// console.log(wordToGuess);

function handleGuesses() {
  let sucessGuess = true;
  // console.log(wordToGuess);
  for (let i = 1; i <= numOfLetters; i++) {
    const inputField = document.querySelector(
      `#guess-${currentTry}-letter-${i}`
    );
    const letter = inputField.value.toUpperCase();
    // console.log(letter)
    const actuallLetter = wordToGuess[i - 1];

    // game logic
    if (letter === actuallLetter) {
      // letter is coreect and in place
      inputField.classList.add("yes-in");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      // letter is correct and not in place
      inputField.classList.add("not-in");
      sucessGuess = false;
    } else {
      inputField.classList.add("wrong");
      sucessGuess = false;
    }
  }
  // check if user win or lose
  if (sucessGuess) {
    // console.log ("you win")
    messageArea.innerHTML = `congrats after ${currentTry} tries. <span>${wordToGuess}</span>`;
    if (numOfHints === 2) {
      messageArea.innerHTML = `<p>Congrats you didn't use any hints</p>`;
    }

    // add disabled class on alll try divs
    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));

    // disabled guess button
    guessButton.disabled = true;
  } else {
    // console.log ("you lose")
    document
      .querySelector(`.try-${currentTry}`)
      .classList.add("disabled-inputs");
    // console.log(currentTry);
    const currentTryInputs = document.querySelectorAll(
      `.try-${currentTry} input`
    );
    currentTryInputs.forEach((input) => (input.disabled = true));
    currentTry++;

    const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
    nextTryInputs.forEach((input) => (input.disabled = false));

    let el = document.querySelector(`.try-${currentTry}`);
    if (el) {
      document
        .querySelector(`.try-${currentTry}`)
        .classList.remove("disabled-inputs");
      el.children[1].focus();
    } else {
      // disable guess button
      guessButton.disabled = true;
      getHintButton.disabled = true;
      messageArea.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`;
    }
  }
}

// hint
function getHint() {
  if (numOfHints > 0) {
    numOfHints--;
    document.querySelector(".hint span").innerHTML = numOfHints;
  }
  if (numOfHints === 0) {
    getHintButton.disabled = true;
  }

  const enabledInputs = document.querySelectorAll("input:not([disabled])");
  // console.log(enabledInputs);
  const emptyEnabledInputs = Array.from(enabledInputs).filter(
    (input) => input.value === ""
  );
  // console.log(emptyEnabledInputs)
  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    const randomInput = emptyEnabledInputs[randomIndex];
    const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
    // console.log(randomIndex)
    // console.log(randomInput)
    // console.log(indexToFill)
    if (indexToFill !== -1) {
      randomInput.value = wordToGuess[indexToFill].toUpperCase();
    }
  }
}

function handleBackSpace(event) {
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])");
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);
    // console.log(currentIndex);
    if (currentIndex > 0) {
      const currentInput = inputs[currentIndex];
      const prevInput = inputs[currentIndex - 1];
      currentInput.value = "";
      prevInput.value = "";
      prevInput.focus();
    }
  }
}

document.addEventListener("keydown", handleBackSpace);

window.onload = function () {
  geneateInput();
};
