let possible_words = data;
let word_index = Math.floor(Math.random() * (possible_words.length + 1));
let entire_word = possible_words[word_index];
let word = [];
let userHasGuessedCorrectly = false;
LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
for (let letter of entire_word) {
    word.push(letter);
}

window.addEventListener("keydown", event => {
    if (event.key == "Enter") {
        submitGuess();
    }
    if (event.key == "Backspace") {
        deleteLetter();
    }
    if (LETTERS.includes(event.key.toUpperCase())) {
        writeLetter(event.key.toUpperCase());
    }
})
console.log(word);

let currentGuess = [];
let currentRow = 1;

function writeLetter(letter) {
    /* Each letter key in the HTML page passes itself as a value to this function */
    if (currentRow < 7 && userHasGuessedCorrectly == false) {
        // If there are still blank guesses remaining
        if (currentGuess.length < 5) {
            // If user has not guessed up to five letters

            currentGuess.push(letter);
            letterIndex = currentGuess.length;
            squareID = "boardrow" + currentRow + "square" + letterIndex;    // Construct the square ID
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
function submitGuess() {
    if (currentGuess.length == 5) {
        if (currentGuess == word) {
            userHasGuessedCorrectly = true;
            endGame();
            return;
        }
        // Checks if the user has guessed a full word
        for (let i=1; i < 6; i++) {
            // Iterates over all the squares in a guess row
            squareID = "boardrow" + currentRow + "square" + i;
            squareValue = document.getElementById(squareID).innerHTML;
            if (squareValue == word[i-1]) {
                // Checks if the value of the square matches the value's index in the word
                document.getElementById(squareID).setAttribute("class", "square correct");
            } else if (word.includes(squareValue)) {
                // Misplaced letter
                document.getElementById(squareID).setAttribute("class", "square misplaced");
            } else {
                document.getElementById(squareID).setAttribute("class", "square guessed");
            }
        }
        currentRow++;   // Begins guessing the next row
        currentGuess = [];
        if (currentRow == 7) {
            if (userHasGuessedCorrectly == false) {
                showWord();
            } else {
                endGame();
            }
        }
    }
}

function showWord() {
    message = document.getElementById("alert");
    messageText = document.getElementById("alert-text");
    messageText.innerHTML = entire_word;
    message.style.display = "flex";
    message.style.animationName = "slide-down";
    setInterval(() => {message.style.animationName = "slide-up";}, 1500);
    setInterval(() => {message.style.display = "none";}, 1900);
}

function endGame() {
    console.log("You got it right!");
}