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
        getCurrentContentCard1: () => {
            return model.currentCardsSelected.card1;
        },
        getCurrentContentCard2: () => {
            return model.currentCardsSelected.card2;
        },
        setCurrentContentCard1: (cardContent) => {
            model.currentCardsSelected.card1 = cardContent;
        },
        setCurrentContentCard2: (cardContent) => {
            model.currentCardsSelected.card2 = cardContent;
        },
        getControlGame: () => {
            return model.controlTheGame;
        },
        setCardShownCounter : (numberCards) => {
            let cardsStored = model.controlTheGame.cardsShown;
            model.controlTheGame.cardsShown = cardsStored + numberCards;
        },
        getMovimentCounter: () => {
            return model.controlTheGame.movimentCounter;
        },
        setMovimenteCounter: () => {
            model.controlTheGame.movimentCounter++;
        },
        resetMovimenteCounter: () => {
            model.controlTheGame.movimentCounter = 0;
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

            //add controls to the game 
            let gameControlElement = document.getElementById("game_control");
            //REstar Btn 
            let restartGameBtnElement = '<span id="restart_game_btn"> <i class="fas fa-redo-alt"></i> </span>';
            gameControlElement.innerHTML = restartGameBtnElement;
            let restardGameBtn = document.getElementById('restart_game_btn');
            restardGameBtn.onclick = function() {
                resetGame();
            }

            //show moviments
            let showMovesElement = document.createElement('span');
            showMovesElement.setAttribute('id', 'show_moves');
            showMovesElement.innerText = octupus.getMovimentCounter() + ' moves';
            gameControlElement.appendChild(showMovesElement);

            //Timer
            let timerElement = document.createElement('span');
            timerElement.setAttribute('id','timer');
            timerElement.innerHTML="00<font color=#000000>:</font>00<font color=#000000>:</font>00";
            gameControlElement.appendChild(timerElement);
            let sHors = "0" + 0; 
            let sMins = "0" + 0;
            let sSecs = -1;
            let timeOut;



            //listen a click on the card
            gridElement.onclick = function(e) {

                let idCardHideClicked = e.target.id;
                let classCardHideClicked = e.target.classList.value;
                let controlTheGame = octupus.getControlGame();
                let contentCard1 = octupus.getCurrentContentCard1();
                let contentCard2 = octupus.getCurrentContentCard2();
                //check if only <td>/card is clicked and the card is hided
                if(idCardHideClicked != "game_grid" && classCardHideClicked == "card_hided") {

                   if(contentCard1 == "" && contentCard2 == "") {
                        let card = showTheCard(idCardHideClicked);
                        octupus.setCurrentContentCard1(card);

                        //start Timer (when the first card is clicked)
                        if(octupus.getMovimentCounter() == 0) {
                            startTimer();
                        }

                    } else if (contentCard1 != "" && contentCard2 == "") {
                        let card = showTheCard(idCardHideClicked);
                        octupus.setCurrentContentCard2(card);
                        //couting the moviments 
                        octupus.setMovimenteCounter();
                        let showMovesElementToUpdate = document.getElementById('show_moves');
                        showMovesElementToUpdate.innerText = octupus.getMovimentCounter() + ' moves';


                        console.log(octupus.getMovimentCounter());
                        
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
                    let contentCard1 = octupus.getCurrentContentCard1();
                    let contentCard2 = octupus.getCurrentContentCard2();
                    if (contentCard1.innerText == contentCard2.innerText) {
                        console.log("match!");
                        resetCards();
                        controlTheGame.cardsShown = controlTheGame.cardsShown + 2;
                        checkEndTheGame();
                        
                    } else {
                        let idCardToHide1 = contentCard1.id;
                        let idCardToHide2 = contentCard2.id;
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

                        resetCards(); 
                    }
                }

                function resetCards() {
                    octupus.setCurrentContentCard1("");
                    octupus.setCurrentContentCard2("");
                }

                function checkEndTheGame() {
                    if(numeberOfCards == controlTheGame.cardsShown) {
                        let modalGameElement = document.querySelector(".modal_game");
                        let modalGameContentElement = document.querySelector(".modal_game_content");
                        let timerEndTheGameElement = document.getElementById('timer');

                        let contentEndTheGame = '<h2>Well Done!!</h2>' +
                                                '<p>You finished with just ' + octupus.getMovimentCounter() + ' moviments!' +
                                                '<p>With the time of ' + timerEndTheGameElement.innerText;
                        modalGameContentElement.innerHTML = contentEndTheGame;

                        let resetBtnEndGameElement = document.createElement('span');
                        resetBtnEndGameElement.setAttribute('id', 'reset_btn_end_game');
                        resetBtnEndGameElement.innerHTML = '<i class="fas fa-redo-alt"></i>';
                        modalGameContentElement.appendChild(resetBtnEndGameElement);
                        let resetBtnEndGame = document.getElementById('reset_btn_end_game');
                        resetBtnEndGame.onclick = function() {
                            modalGameElement.classList.add("hide");
                            resetGame();
                        }

                        clearTimeout(timeOut);

                        modalGameElement.classList.remove("hide");


                        
                    }
                }
                
            };

            function startTimer() {
                /*
                Author:	Idelbrandes Goncalves de Amorim
                Date:	02/jul/2004
                URL: https://www.scriptbrasil.com.br/download/codigo/5373/
                */
                sSecs++;
                if(sSecs == 60){
                    sSecs = 0;
                    sMins++;
                    if(sMins <= 9) {
                        sMins = "0" + sMins;
                    }
                }
                if(sMins == 60){
                    sMins = "0" + 0;
                    sHors++;
                    if(sHors <= 9) {
                        sHors = "0" + sHors;
                    }
                }
                if(sSecs <= 9) {
                    sSecs = "0" + sSecs;
                }

                timerElement.innerHTML = sHors + "<font color=#000000>:</font>" + sMins + "<font color=#000000>:</font>" + sSecs;
                timeOut =  setTimeout(startTimer,1000);            
            }

            function resetGame() {
                gridElement.innerHTML = "";
                octupus.resetMovimenteCounter();
                octupus.init();
            }


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
