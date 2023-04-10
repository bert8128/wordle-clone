let possible_words = data;
let valid_guesses = guesses;
let word_index = Math.floor(Math.random() * (possible_words.length + 1));
let entire_word = possible_words[word_index];
let word = Array.from(entire_word);
let userHasGuessedCorrectly = false;
LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

window.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    submitGuess();
  }
  if (event.key == "Backspace") {
    deleteLetter();
  }
  if (LETTERS.includes(event.key.toUpperCase())) {
    writeLetter(event.key.toUpperCase());
  }
});

let currentGuess = [];
let currentRow = 1;
let flipDelay = 0;

async function validateWord(enteredWord) {
  if (valid_guesses.includes(enteredWord)) {
    return true;
  }
  return false;
}

function writeLetter(letter) {
  /* Each letter key in the HTML page passes itself as a value to this function */
  if (currentRow < 7) {
    if (userHasGuessedCorrectly == true) {
      return;
    }
    // If there are still blank guesses remaining
    if (currentGuess.length < 5) {
      // If user has not guessed up to five letters

      currentGuess.push(letter);
      letterIndex = currentGuess.length;
      squareID = "boardrow" + currentRow + "square" + letterIndex; // Construct the square ID
      document.getElementById(squareID).innerHTML = letter;
    }
  }
}

function deleteLetter() {
  if (currentGuess.length > 0) {
    // If there are any letters to delete

    letterIndex = currentGuess.length;
    currentGuess.pop();
    squareID = "boardrow" + currentRow + "square" + letterIndex;
    document.getElementById(squareID).innerHTML = "";
  }
}
async function submitGuess() {
  let flipDelay = 0;
  let to_be_animated = [];
  if (userHasGuessedCorrectly == true) {
    // Checks if the game has already been won
    return;
  }
  if (currentGuess.length == 5) {
    // Checks if the user has guessed a full word
    let guessedWord = "";
    for (letter of currentGuess) {
      // Helper loop to form guess array into strings
      guessedWord += letter;
    }

    let valid = await validateWord(guessedWord);
    // ===============

    if (!valid) {
      showAlert("alert-fake-word", "alert-fake-word-text", "Not a word!");
      return;
    }

    let number_of_each_letter = new Map();
    for (let i = 1; i < 6; i++) {
      let letter = word[i - 1];
      if (number_of_each_letter.has(letter)) {
        let current = number_of_each_letter.get(letter);
        number_of_each_letter.set(letter, current+1);
      }
      else {
        number_of_each_letter.set(letter, 1);
      }
    }
    console.log(number_of_each_letter);
    
    // do the greens first to count down preferentially on exact matches
    for (let i = 1; i < 6; i++) {
      // Iterates over all the squares in a guess row
      squareID = "boardrow" + currentRow + "square" + i;
      squareValue = document.getElementById(squareID).innerHTML;

      if (squareValue == word[i - 1]) {
        // Checks if the value of the square matches the value's index in the word
        let current_left = number_of_each_letter.get(squareValue);
        number_of_each_letter.set(letter, current_left-1);
        to_be_animated.push({
          id: squareID,
          delay: flipDelay,
          newClass: "square correct",
        });
      }
      flipDelay += 300;
    }
    flipDelay = 0;
    for (let i = 1; i < 6; i++) {
        // Iterates over all the squares in a guess row
        squareID = "boardrow" + currentRow + "square" + i;
        squareValue = document.getElementById(squareID).innerHTML;
  
        if (squareValue != word[i - 1]) {
          let current_left = number_of_each_letter.get(squareValue);
          console.log(i + " " + squareValue + " " + current_left);
          if (word.includes(squareValue) && current_left > 0) {
          // Misplaced letter
            number_of_each_letter.set(squareValue, current_left-1);
            to_be_animated.push({
              id: squareID,
              delay: flipDelay,
              newClass: "square misplaced",
            });
          } else {
            to_be_animated.push({
              id: squareID,
              delay: flipDelay,
              newClass: "square guessed",
            });
          }
        }
        flipDelay += 300;
    }

    for (let i = 0; i < to_be_animated.length; i++) {
      let element = to_be_animated[i];
      setTimeout(() => {
        animateLetter(element["id"], element["delay"], element["newClass"]);
        i++;
        if (element["newClass"] == "square guessed") {
          squareValue = document.getElementById(element["id"]).innerHTML;
          document
            .getElementById(squareValue)
            .setAttribute("class", "key faded");
        }
      }, element["delay"]);
    }

    currentRow++; // Begins guessing the next row
    if (currentGuess.toString() == word.toString()) {
      // Check if player has won the game
      userHasGuessedCorrectly = true;
      endGame();
      return;
    }
    currentGuess = [];
    if (currentRow == 7) {
      if (userHasGuessedCorrectly == false) {
        setTimeout(() => {
          showAlert("alert-answer", "alert-answer-text", entire_word);
        }, 1500);
      }
      endGame();
    }
  }
}

function showAlert(alertID, alertTextID, alertMessage) {
  message = document.getElementById(alertID);
  messageText = document.getElementById(alertTextID);
  messageText.innerHTML = alertMessage;
  message.style.display = "flex";
  message.style.animationName = "slide-down";
  setInterval(() => {
    message.style.animationName = "slide-up";
  }, 1500);
  setInterval(() => {
    message.style.display = "none";
  }, 2000);
}

function animateLetter(squareID, delay, newClass) {
  square = document.getElementById(squareID);
  square.style.animationName = "flip";
  square.setAttribute("class", newClass);
}

function endGame() {
  if (userHasGuessedCorrectly) {
    banner = document.getElementById("victory-banner");
  } else {
    banner = document.getElementById("defeat-banner");
  }
  setTimeout(() => {
    banner.style.display = "block";
  }, flipDelay + 1000);
}

function closeBanner() {
  banner = document.getElementsByClassName("banner");
  for (b of banner) {
    b.style.display = "none";
  }
}
