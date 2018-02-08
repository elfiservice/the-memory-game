$(function() {

    let model = {
        Grid: function (row, col) {
            this.row = row,
            this.col = col
        },
        level: function (levelNumber) {
            switch(levelNumber) {
                case 0: return ['☯','♫','☯','♫','♞','♞','☂','☂','☀','☀','❤','❤','😀','😀','😜','😜']; break;
                default: console.log('Error Level not passed');
                
            }
        },
        currentCardsSelected: {
            'idCard1' : '',
            'idCard2' : '',
            'card1' : '',
            'card2' : ''
        },
        controlTheGame: {
            'cardsShown' : 0,
            'movimentCounter' : 0
        }
    }

    let octupus = {
        getGrid: (row, col) => {
            return new model.Grid(row, col);
        },
        getLevel: (level) => {
            let cardsArray = model.level(level);
            //Sorting an Array in Random Order
            return cardsArray.sort(function(a, b){return 0.5 - Math.random()});            
        },
        getCurrentsCards: () => {
            return model.currentCardsSelected;
        },
        getControlGame: () => {
            return model.controlTheGame;
        },
        

        init: () => {
            view.init();
        }
    }

    let view = {
        init: () => {
            //get a array with values for the level -> level 0 = 16 cards
            let cardsArray = octupus.getLevel(0);
            let  numeberOfCards = cardsArray.length;
            //toDo: find the best algoritm to divide correct distribuition for the memory game
            const numRows = Math.round(numeberOfCards/4);
            const numCol = numRows;
                
            //get instance for the Grid
            let Grid = octupus.getGrid(numRows, numCol);
            let gridElement = document.getElementById('game_grid');
            //built the game structure
            let fragmentBuilded = view.buildGame(Grid, cardsArray);
            gridElement.appendChild(fragmentBuilded);

            //listen a click on the card
            gridElement.onclick = function(e) {

                let idCardHideClicked = e.target.id;
                let classCardHideClicked = e.target.classList.value;
                let currentsCards = octupus.getCurrentsCards();
                let controlTheGame = octupus.getControlGame();
                //check if only <td>/card is clicked and the card is hided
                if(idCardHideClicked != "game_grid" && classCardHideClicked == "card_hided") {

                   if(currentsCards.card1 == "" && currentsCards.card2 == "") {
                        let card = showTheCard(idCardHideClicked);
                        currentsCards.card1 = card.innerText;
                        currentsCards.idCard1 = card.id;

                    } else if (currentsCards.card1 != "" && currentsCards.card2 == "") {
                        let card = showTheCard(idCardHideClicked);
                        currentsCards.card2 = card.innerText;
                        currentsCards.idCard2 = card.id;
                        //check if the cards have a match after 1s (the user need to  have time to see the two cards clicked)
                        setTimeout(checkCardsMatch, 1000);
                      
                    }
                }

                function showTheCard(idCardHideClicked) {
                    let idElementToShow = idCardHideClicked.split("-");
                    let cardToShow = document.getElementById(idElementToShow[0]);               
                    cardToShow.classList.remove("hide");

                    let cardHided = document.getElementById(idCardHideClicked);
                    cardHided.classList.add("hide");
                    
                    return cardToShow;
                }

                function checkCardsMatch() {
                    if (currentsCards.card1 == currentsCards.card2) {
                        console.log("match!");
                        currentsCards.card1 = "";
                        currentsCards.card2 = "";
                        controlTheGame.cardsShown = controlTheGame.cardsShown + 2;
                        checkEndTheGame();
                        
                    } else {
                        let idCardToHide1 = currentsCards.idCard1;
                        let idCardToHide2 = currentsCards.idCard2;
                        let idCardToShow1 = idCardToHide1 + '-hide';
                        let idCardToShow2 = idCardToHide2 + '-hide';
                        let hideCard1 = document.getElementById(idCardToHide1);
                        hideCard1.classList.add("hide");
                        let cardToShow1 = document.getElementById(idCardToShow1);               
                        cardToShow1.classList.remove("hide");

                        let hideCard2 = document.getElementById(idCardToHide2);
                        hideCard2.classList.add("hide");
                        let cardToShow2 = document.getElementById(idCardToShow2);               
                        cardToShow2.classList.remove("hide");

                        currentsCards.card1 = "";
                        currentsCards.card2 = "";
                        
                    }
                }

                function checkEndTheGame() {
                    if(numeberOfCards == controlTheGame.cardsShown) {
                        alert('Well done !');
                        
                    }
                }

                
            };

            // let t0 =  performance.now();

        //     let t1 =  performance.now();
        //  console.log(t1 - t0);
      
        },
        buildGame: (Grid, cards) => {
            //improved the performance of 0.312ms to 0.195ms using the fragment
            let fragment = document.createDocumentFragment();
            let numberCardsCount = 0;
            for(let r = 1; r <= Grid.row; r++) {
                let createRow = document.createElement("tr");
                for(let c = 1; c <= Grid.col; c++) {
                    let createdCard = document.createElement("td");
                    createdCard.setAttribute("class", "hide card");
                    createdCard.setAttribute("id", r+''+c);
                    createdCard.innerText = cards[numberCardsCount];
                    createRow.appendChild(createdCard);

                    let createdCardHide = document.createElement("td");
                    createdCardHide.setAttribute("class", "card_hided");
                    createdCardHide.setAttribute("id", r+''+c +'-hide');
                    createdCardHide.innerText = "?";
                    createRow.appendChild(createdCardHide);
                    numberCardsCount++;
                }
                
                fragment.appendChild(createRow);
                
            }

            return fragment;
        }
    }

    //app start here
    octupus.init();
});
