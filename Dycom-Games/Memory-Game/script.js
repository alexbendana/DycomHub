//Array of different card objects including the id/img src/name & difficulty
const cards = [ 
    {
        id: 1,
        img: "./dycomLogos/ukg.png",
        name: "ukg",
        difficulty: ["easy", "medium", "hard"]
    },
    {
        id: 2,
        img: "./dycomLogos/okta.webp",
        name: "okta",
        difficulty: ["easy", "medium", "hard"]
    },
    {
        id: 3,
        img: "./dycomLogos/mdr.png",
        name: "mdr",
        difficulty: ["easy", "medium", "hard"]
    },
    {
        id: 4,
        img: "./dycomLogos/LogMeIn.jpg",
        name: "lmi",
        difficulty: ["easy", "medium", "hard"]
    },
    {
        id: 5,
        img: "./dycomLogos/aws.webp",
        name: "aws",
        difficulty: ["easy", "medium", "hard"]
    },
    {
        id: 6,
        img: "./dycomLogos/cyberark.png",
        name: "cyberark",
        difficulty: ["easy", "medium", "hard"]
    },
    {
        id: 7,
        img: "./dycomLogos/smartsheet.png",
        name: "smartsheet",
        difficulty: ["medium", "hard"]
    },
    {
        id: 8,
        img: "./dycomLogos/atlas.png",
        name: "atlas",
        difficulty: ["medium", "hard"]
    },
    {
        id: 9,
        img: "./dycomLogos/dycom.png",
        name: "dycom",
        difficulty: ["medium", "hard"]
    },
    {
        id: 10,
        img: "./dycomLogos/gmail.webp",
        name: "gmail",
        difficulty: ["hard"]
    },
    {
        id: 11,
        img: "./dycomLogos/drive.png",
        name: "drive",
        difficulty: ["hard"]
    },
    {
        id: 12,
        img: "./dycomLogos/zoom.png",
        name: "zoom",
        difficulty: ["hard"]
    },
    {
        id: 13,
        img: "./dycomLogos/gitlab.png",
        name: "gitlab",
        difficulty: ["hard"]
    },
    {
        id: 14,
        img: "./dycomLogos/certus.svg",
        name: "certuslearn",
        difficulty: ["hard"]
    },
    {
        id: 15,
        img: "./dycomLogos/rtasq.png",
        name: "rtasq",
        difficulty: ["hard"]
    } 
]
//variable of moves
let moves = 0; 
//updates score
document.getElementById("moves").textContent = moves; 
//empty array of flipped cards
let flippedCards =[]; 
//boolean to lock the cards so the user cannot click more than 2 cards at once
let clickable = true; 


//DOM functions - these load once the page loads
$(function(){
    //jQuery variables
    $winScreen = $("#win-screen"); 
    $menu = $("#menu");
    $gameBoard = $("#gameboard");
    $popup = $("#popup");
    //making jQuery variables be seen/hide them
    $menu.hide();
    $popup.show();

    //jQuery click event for the play button
    $("#playButton").on("click", function(){
        //once the play button is clicked hide the popup, create cards, show the menu, show the gameboard & empty the name field
        $popup.hide();
        createCards();
        $menu.show();
        $gameBoard.show();
        $("#name").val("");
    });

    //jQuery change event for the difficulty drop down
    $("#difficulty").on("change", function(){
        //resetting the board, hiding the gameboard, hiding the menu, hiding the win screen and showing the popup
        reset();
        $gameBoard.hide();
        $menu.hide();
        $winScreen.hide();
        $popup.show();
    });

    //jQuery click event for the reset button
    $("#reset").on("click", function(){
        //once the reset button is hit, hide the win screen and reset the board
        $winScreen.hide();
        reset();
    });

    //jQuery click event for the replay button on the win screen
    $("#replay").on("click", function(){
        //once the replay button is clicked, hide the win screen, show the gameboard, show the menu, and reset the board
        $winScreen.hide();
        $gameBoard.show();
        $menu.show();
        reset();
    });
});


//function to create the cards by difficulty
function createCards(){
    let filteredCardsByDifficulty = difficulty();
    //grabbing gameboard div in html using jQuery
    $gameBoard = $("#gameboard");

    //emptying gameboard 
    $gameBoard.empty();

    // new array for pairs
    const pairedCards = filteredCardsByDifficulty.concat(filteredCardsByDifficulty);

    //calling the shuffle function on all the cards on the screen
    shuffle(pairedCards);

    //making all the cards based on how many cards in the array
    for(let i = 0; i < pairedCards.length; i++){
        //newcard
        const $newCard = $("<div class='card'></div>");
        //front face
        const $frontCard = $("<div class='front'></div>");
        //back face
        const $backCard = $("<div class='back'></div>");

        //setting each cards front face to the correct img src based on the cards object
        $frontCard.html(`<img src="${pairedCards[i].img}" alt="${pairedCards[i].name}" width="140px" height="140px" >`);

        //appending front / back to the newCard
        $newCard.append($frontCard);
        $newCard.append($backCard);
        //appending newCard to the gameboard
        $newCard.appendTo($gameBoard);
        
        //event listener for each card in the gameboard
        $newCard.click(flipCard);
    }
    
}

//function to choose difficulty
function difficulty(){
    //grabbing the difficulty the user wants
    let $difficulty = $("#difficulty").val().toLowerCase();
    //making an empty array of the cards based on the difficulty
    let filteredCardsByDifficulty = [];

    //loop / if statement to add cards to the array based on the difficulty in the cards object
    for(let i = 0; i < cards.length; i++){
        if(cards[i].difficulty.includes($difficulty)){
            filteredCardsByDifficulty.push(cards[i]);
        }
    }
    return filteredCardsByDifficulty;
}

//function to shuffle the cards
function shuffle(cards){
    //Fisher-Yates shuffle
    // making a diff array, grabbing a random index & swapping the elements to shuffle cards
    for(let i = cards.length - 1; i > 0; i--){
        let j = Math.floor(Math.random() * (i + 1));
        let temp = cards[i];
        cards[i] = cards[j];
        cards[j] = temp;
        
    }
    return cards;
}

//function to flip the card
function flipCard(){
    //if clickable is false, make the card unclickable
    if(!clickable){
        return;
    } 

    if($(this).hasClass("matched") || $(this).hasClass("flipped")){
        return;
    } 
    //add the flipped class to the card that has been clicked
    $(this).addClass("flipped");
    //add the card that was clicked to the flippedCards array
    flippedCards.push($(this));
    //once the user has clicked 2 cards, set clickable to false so they cannot click anymore & call the match function to see if they match
    if(flippedCards.length === 2){
        clickable = false;
        match();
        
    }
}

//function to check for a match
function match(){
    
    //if the user has flipped 2 cards
    if(flippedCards.length === 2){
        //put values of the two cards in variables - compare variable traits
        let card1ID = flippedCards[0].find(".front img").attr("alt");
        let card2ID = flippedCards[1].find(".front img").attr("alt");

        //if the card id's match add a class of matched, turn off the event & make the card null
        if(card1ID === card2ID){
            for(let i = 0; i < flippedCards.length; i++){
                flippedCards[i].addClass("matched");
                flippedCards[i].off("click", flipCard);
                flippedCards[i] = null;
            }
            //make cards clickable
            clickable = true;
        }
        //if the card id's do not match call the unflipCards function to unflip the cards
        else{
            unflipCards(flippedCards);
        }
        
    }
    
    //increase moves by 1 after a failed/ successful attempt
    moves++;
    //update moves counter on screen
    document.getElementById("moves").textContent = moves;

    //empty flippedCards array
    flippedCards = [];
    
    //check if the user has completed all cards on the screen
    checkWin();
}

//function to check if the user has completed the whole board
function checkWin(){
    //grabbing all the cards on the screen
    const $allCards = $(".card");
    //grabbing all the cards that have been matched
    const $matchedCards = $(".card.flipped.matched");

    //if all cards have been matched, show the win screen & hide the gameboard/menu
    if($allCards.length === $matchedCards.length){
        $("#win-screen").show();
        $("#gameboard").hide();
        $("#menu").hide();
    }
}

//function to unflipCards
function unflipCards(mismatchCards){
    //removing class flipped after 1000 ms
    setTimeout(function(){
        mismatchCards[0].removeClass("flipped");
        mismatchCards[1].removeClass("flipped");
        clickable = true;
    }, 1000);
}

//function to reset the board
function reset(){
    //empties the board
    $("#gameboard").empty();
    //make the moves variable 0
    moves = 0;
    //updates moves txtContent
    document.getElementById("moves").textContent = moves;
    //creating the cards
    createCards();
}

//show score once the game ends
//celebration screen
//error notification if they get a match wrong
//scoreboard
//survery
