//array of all dycom related words
const words = [
    "rtasq",
    "dycom",
    "atlas",
    "cyber",
    "field",
    "audit",
    "email",
];

//worlde allows 6 guesses
const totalGuesses = 6;

//variable to keep track of the game
let guessesRemaining = totalGuesses; 
let currentGuess = []; //current guess that is being formed
let nextLetter = 0; //index for the next letter 

//selects random word from words array
let correctString = words[Math.floor(Math.random() * words.length)];

//DOM - loads when page loads
$(function(){
    //event handler to handle when a key is released- for enter / backspace
    $(document).on("keyup", function(event){
        //doesn't allow the user to continue if they used all guess
        if(guessesRemaining === 0){
            return;
        }

        //getting the key pressed as a string
        let pressedKey = String(event.key)

        //allows user to delete letters 
        if(pressedKey === "Backspace" && nextLetter !== 0){
            deleteLetter();
            return;
        }

        //allows user to submit a guess
        if(pressedKey === "Enter"){
            checkGuess();
            return;
        }

        //filters user input so only alphabetical characters come through
        let correctInput = pressedKey.match(/[a-z]/gi);
        if(!correctInput || correctInput > 1){
            return;
        }else{
            inputLetter(pressedKey);
        }
    });

    //event handler to make the keyboard work
    $(document).on("click", function(e) {
        const $target = $(e.target);

        //make sure the kb button is also on the screen
        if (!$target.hasClass("keyboard-button")){
            return;
        }

        let key = $target.text();

        //this just makes the "Del" on screen button act as backspace
        if (key === "Del"){
            key = "Backspace";
        }

        //this line allows the on screen kb to align with the physical input
        //allows physical input to be handled 
        $(document).trigger($.Event("keyup", { key: key}))

    });

    function generateBoard(){
        let $gameboard = $("#gameboard");
        //creating a row in html for each guess
        for(let i = 0; i < totalGuesses; i++){
            const $row = $("<div class='row'></div>");
    
            //creating 5 tiles to each row
            for(let j = 0; j < 5; j++){
                const $tile = $("<div class='tile'></div>");
                $row.append($tile);
            }
            $row.appendTo($gameboard);
    
        }
    }

    generateBoard();
    
    function inputLetter(letter){
        //no more than 5 letters per row
        if (nextLetter === 5){
            return;
        }

        letter = letter.toLowerCase();

        //add letter to the array
        currentGuess.push(letter);

        //finding where the letter has to go
        //finding all the children of gameboard, then index depending on guesses
        let row = $("#gameboard").children().eq(totalGuesses - guessesRemaining);
        let tile = row.children().eq(nextLetter);
        $(tile).addClass("filled");
        tile.text(letter);

        nextLetter++;
    }

    function deleteLetter(letter){
        //do nothing if there is nothing to delete
        if (nextLetter === 0){
            return;
        }
        //remove last letter from the guess
        currentGuess.pop();
        nextLetter--;

        //updating the tile in the current row
        let row = $("#gameboard").children().eq(totalGuesses - guessesRemaining);
        let tile = row.children().eq(nextLetter);
        $(tile).removeClass("filled");
        tile.text('');
    }

    function checkGuess(){
        let $row = $("#gameboard").children().eq(totalGuesses - guessesRemaining);
        let $userGuessedString = '';

        let $correctGuess = [...correctString]; //copy of the string

        //making the user guessed string
        for (const letter of currentGuess){
            $userGuessedString += letter;
        }

        //making sure the word is 5 letters
        if ($userGuessedString.length != 5){
            alert("Not enough letters!")
            return;
        }

        //check if word is in the list
        if(!words.includes($userGuessedString)){
            alert("Word not in list!")
            return;
        }

        //checking each letter
        //changing tile color based off of letter accuracy
        for(let i = 0; i < 5; i++){
            let letterColor = '';
            let $tile = $row.children().eq(i); //getting the child element, then the index
            let letter = currentGuess[i];

            let position = $correctGuess.indexOf(letter);
            // this asks if the letter is in the correct word
            if(position === -1){
                letterColor = "grey"; //letter is not in the word
            }
            else{
                //the letter is in the word 100%
                //we need to know if its in the right position
                if(currentGuess[i] === correctString[i]){
                    letterColor = "green"; //correct position
                }
                else{
                    //letter is yellow 100%
                    letterColor = "yellow";
                }
                //currently doesn't work but this is so that it doesn't think there is 2 a's in the word "audit" when guessing "atlas"
                correctString[position] = "#"; //using # to mark as checked
            }

            let timer = 250 * i; //animation effect
            setTimeout(()=> {
                //shading the tiles
                $tile.css("background-color", letterColor)
                //function to color the keyboard
                colorKeyboard(letter, letterColor)
            }, timer)
        }

        //comparing strings 
        if($userGuessedString === correctString){
            alert("You win! Game over")
            guessesRemaining = 0;
            return;
        }
        else{
            //updating the game for the next guess
            guessesRemaining -= 1;
            currentGuess = [];
            nextLetter = 0;
            //end game if the user tries all 6 guesses
            if(guessesRemaining === 0){
                alert("You have no more guesses left! Game over")
                alert("The correct word was: " + correctString)
            }
        }
    }

    //work in progress function that is supposed to color the keyboard
    function colorKeyboard(letter, color){

        
        for(let button of document.getElementsByClassName("keyboard-button")){
            if (button.textContent === letter){
                let oldColor = button.style.backgroundColor;
                if(oldColor === "green"){
                    return;
                }

                if(oldColor === "yellow" && color !== "green"){
                    return;
                }

                button.stytle.backgroundColor = color;
                break;
            }
        }
    }

});






//adding notifications
//adding animations