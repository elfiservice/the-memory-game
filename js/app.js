document.addEventListener('DOMContentLoaded', function () {

    const model = {
        Grid: function (row, col) {
            this.row = row,
            this.col = col
        },
        level: function (levelNumber) {
            switch(levelNumber) {
                case 0: return ['☯','♫','☯','♫','♞','♞','☂','☂','☀','☀','❤','❤']; break;
                case 1: return ['☯','♫','☯','♫','♞','♞','☂','☂','☀','☀','❤','❤','😀','😀','😜','😜']; break;
                case 2: return ['☯','♫','☯','♫','♞','♞','☂','☂','☀','☀','❤','❤','😀','😀','😜','😜','👻','👻','👀','👀']; break;
                default: console.log('Error Level not passed');
                
            }
        },
        currentCardsSelected: {
            'card1' : '',
            'card2' : ''
        },
        controlTheGame: {
            'cardsShown' : 0,
            'movimentCounter' : 0,
            'currentStarRating' : 3,
            'currentLevel' : 0,
            'scores' : 0,
            'currentPlayerID' : 0
        },
        starRating: function(number) {
            switch(number) {
                case 0: return "☆☆☆"; break;
                case 1: return "★☆☆"; break;
                case 2: return "★★☆"; break;
                case 3: return "★★★"; break;
                default: console.log('Error, Number of Stars not provided');
                
            }
        }

    }


    
    const octupus = {
        getGrid: (row, col) => {
            return new model.Grid(row, col);
        },
        getLevel: () => {
            return model.controlTheGame.currentLevel;
        },
        getLevelCards: () => {
            const level = model.controlTheGame.currentLevel;
            let cardsArray = model.level(level);
            //Sorting an Array in Random Order
            return cardsArray.sort(function(a, b){return 0.5 - Math.random()});            
        },
        setLevel: (level) => {
            model.controlTheGame.currentLevel = level;
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
        getCardsShownCounter: () => {
            return model.controlTheGame.cardsShown;
        },
        setCardShownCounter : () => {
            let cardsStored = model.controlTheGame.cardsShown;
            model.controlTheGame.cardsShown = cardsStored + 2;
        },
        getMovimentCounter: () => {
            return model.controlTheGame.movimentCounter;
        },
        setMovimenteCounter: () => {
            model.controlTheGame.movimentCounter++;
        },
        resetControls: (levelToSet) => {
            model.controlTheGame.movimentCounter = 0;
            model.controlTheGame.cardsShown = 0;
            model.controlTheGame.currentStarRating = 3;
            model.controlTheGame.currentLevel = levelToSet;
        },
        setStarRating: (numOfStarsRating) => {
            model.controlTheGame.currentStarRating = numOfStarsRating;
        },
        getStarRating: () => {
            const numberOfStars = model.controlTheGame.currentStarRating;
            return model.starRating(numberOfStars);
        },
        setNameOfPlayer: (name) => {
            var uniqueId = (new Date).getTime(); 
            model.controlTheGame.currentPlayerID = uniqueId;
            
            localStorage.setItem("player-" + uniqueId, name);
        },
        getNameOfPlayer: () => {
            return localStorage.getItem("player-" + model.controlTheGame.currentPlayerID);
        },
        getRanking: () => {
            let playerList = "";
            for (var i = 0; i < localStorage.length; i++){
                let stringKey = localStorage.key(i);
                if(stringKey.indexOf('player-') > -1) {
                    let player = localStorage.getItem(localStorage.key(i));
                    playerList += `<li> ${player} </li>`;
                }
            }
            return playerList;
        },

        init: () => {
            view.init();
            
        }
    }

    const view = {
        init: () => {
            const [modalGameElement, modalGameContentElement] = view.getModalStructure();
            
            //input form ot get name of the player before start the game
            let contentAddNamePlayer = '<h2>Lets Start the Game!</h2>' +
            '<p><label>Your Nickname: </label> <input id="name_of_player" value="" type="text" required>' +
                '<button class="save_name_player_btn" > Go! </button></p>';
            modalGameContentElement.innerHTML = contentAddNamePlayer;

            //List of Players - Ranking
            let playerListElement = document.createElement('ul');
            playerListElement.innerHTML = octupus.getRanking();
            modalGameContentElement.appendChild(playerListElement);
            
            //show the model on the screen
            modalGameElement.classList.remove("hide");

            //handler when save name player btn is clicked 
            let saveNamePlayerBtn = document.querySelector(".save_name_player_btn");
            saveNamePlayerBtn.onclick = function() {
                const nameOfPlayer = document.getElementById('name_of_player');
                let playerName; 
                if(!nameOfPlayer.value) {
                    playerName = 'quest';
                } else {
                    playerName = nameOfPlayer.value;
                }
                
                //save the name of player in the local storage
                octupus.setNameOfPlayer(playerName);
                
                //close modal
                modalGameElement.classList.add("hide");
                view.startTheGame();
            }
            
        },
        getModalStructure: () => {
            const modalGameElement = document.querySelector(".modal_game");
            const modalGameContentElement = document.querySelector(".modal_game_content");

            return [modalGameElement, modalGameContentElement];
        },
        startTheGame: () => {
            let gridElement = document.getElementById('game_grid');
            const [modalGameElement, modalGameContentElement] = view.getModalStructure();
            //get a array with values for the level -> level 0 = 16 cards
            let cardsArray = octupus.getLevelCards();
            let  numeberOfCards = cardsArray.length;
            //toDo: find the best algoritm to divide correct distribuition for the memory game
            let divisionRowCol = Math.sqrt(numeberOfCards);
            divisionRowCol = Math.trunc(divisionRowCol);
            
            const numRows = Math.round(numeberOfCards/divisionRowCol);
            //const numCol = numRows;
            const numCol = divisionRowCol;


                
            //get instance for the Grid
            let Grid = octupus.getGrid(numRows, numCol);
        

            //built the game structure
            let fragmentBuilded = view.buildGame(Grid, cardsArray);
            gridElement.appendChild(fragmentBuilded);

            //Name of the player
            let nameOfPlayerEle
            let nameOfPlayerElement = document.getElementById('player_name');
            nameOfPlayerElement.innerHTML = `<h3>${octupus.getNameOfPlayer()}</h3>`;

            //add controls to the game 
            let gameControlElement = document.getElementById("game_control");

            //Reset Btn 
            let restartGameBtnElement = '<span id="restart_game_btn"> <i class="fas fa-redo-alt"></i> </span>';
            gameControlElement.innerHTML = restartGameBtnElement;
            let restardGameBtn = document.getElementById('restart_game_btn');
            restardGameBtn.onclick = function() {
                resetGame(0);
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

            //Rating Stars
            let starRatingElementCreated = document.createElement('span');
            starRatingElementCreated.setAttribute('id','star_rating');
            starRatingElementCreated.innerText = octupus.getStarRating(3);
            gameControlElement.appendChild(starRatingElementCreated);
            let starRatingElement = document.getElementById('star_rating');


            //listen a click on the card
            gridElement.onclick = function(e) {

                
                let idCardHideClicked = e.target.id;
                let classCardHideClicked = e.target.classList.value;
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
                        
                        //check number of star Rating
                        checkStarRating();
                        starRatingElement.innerText = octupus.getStarRating();

                        //check if the cards have a match after 1s (the user need to  have time to see the two cards clicked)
                        setTimeout(checkCardsMatch, 1000);
                        
                    }
                }

                function showTheCard(idCardHideClicked) {
                    let idElementToShow = idCardHideClicked.split("-");
                    let cardToShow = document.getElementById(idElementToShow[0]);               

                    playSound('sounds/card-clicked.wav');
                    cardToShow.offsetParent.parentElement.classList.toggle("hover");

                    return cardToShow;
                }

                function checkCardsMatch() {
                    let contentCard1 = octupus.getCurrentContentCard1();
                    let contentCard2 = octupus.getCurrentContentCard2();
                    let idCardToHide1 = contentCard1.id;
                    let idCardToHide2 = contentCard2.id;

                    let hideCard1 = document.getElementById(idCardToHide1);
                    let hideCard2 = document.getElementById(idCardToHide2);

                    if (contentCard1.innerText == contentCard2.innerText) {
                        playSound('sounds/cards-match.mp3');
                        hideCard1.offsetParent.parentElement.classList.add("jump");
                        hideCard2.offsetParent.parentElement.classList.add("jump");
                        resetCards();
                        octupus.setCardShownCounter();
                        checkEndTheGame();
                        
                    } else {
                        playSound('sounds/cards-not-match.wav');
                        
                        hideCard1.offsetParent.parentElement.classList.add("shake");
                        hideCard2.offsetParent.parentElement.classList.add("shake");

                        setTimeout(() => {
                            hideCard1.offsetParent.parentElement.classList.toggle("hover");
                            hideCard2.offsetParent.parentElement.classList.toggle("hover");
                            hideCard1.offsetParent.parentElement.classList.remove("shake");
                            hideCard2.offsetParent.parentElement.classList.remove("shake");
                        }, 1000);

                        resetCards(); 
                    }
                }

                function resetCards() {
                    octupus.setCurrentContentCard1("");
                    octupus.setCurrentContentCard2("");
                }

                function checkEndTheGame() {
                    if(numeberOfCards == octupus.getCardsShownCounter()) {

                        let timerEndTheGameElement = document.getElementById('timer');

                        let contentEndTheGame = '<h2>Well Done!!</h2>' +
                                                '<p>You finished with just ' + octupus.getMovimentCounter() + ' moviments!' +
                                                '<p>With the time of ' + timerEndTheGameElement.innerText + '</p>' +
                                                '<p>'+ starRatingElement.innerText +'</p>' +
                                                '<p><img width="10%" src="images/bananaman.gif" alt="A animeted gift with a Dacing banana" ></p>';
                        modalGameContentElement.innerHTML = contentEndTheGame;

                        let nextLevelElement = document.createElement('div');
                        nextLevelElement.setAttribute('id','next_level_btn');
                        let nextLevelText =  '';

                        const level = octupus.getLevel();
                        if(level >= 0 && level < 2) {
                            nextLevelText = `Go to Level ${level + 2}`;
                        } else {
                            nextLevelText = 'You Finished the Game!!'
                        }
                        nextLevelElement.innerText = nextLevelText;
                        modalGameContentElement.appendChild(nextLevelElement);
                        let nextLevelBtn = document.getElementById('next_level_btn');
                        nextLevelBtn.onclick = function() {
                            modalGameElement.classList.add("hide");
                            setNextLevel();
                        };

                        let resetBtnEndGameElement = document.createElement('div');
                        resetBtnEndGameElement.setAttribute('id', 'reset_btn_end_game');
                        resetBtnEndGameElement.innerHTML = '<i class="fas fa-redo-alt"></i>';
                        modalGameContentElement.appendChild(resetBtnEndGameElement);
                        let resetBtnEndGame = document.getElementById('reset_btn_end_game');
                        resetBtnEndGame.onclick = function() {
                            modalGameElement.classList.add("hide");
                            resetGame(0);
                        }

                        clearTimeout(timeOut);

                        modalGameElement.classList.remove("hide");


                        
                    }
                }
                
            };

            function checkStarRating() {
                let moves = octupus.getMovimentCounter();
                if(moves > 12 && moves <= 20) {
                    octupus.setStarRating(2);
                } else if (moves > 20 && moves <= 30) {
                    octupus.setStarRating(1);
                } else if (moves > 30) {
                    octupus.setStarRating(0);
                }
            }

            function startTimer() {
                /*
                Author:	Idelbrandes Goncalves de Amorim
                Date:	02/jul/2004
                URL: https://www.scriptbrasil.com.br/download/codigo/5373/
                */
                sSecs++;
                if(sSecs == 60){
                    playSound('sounds/time-past-one-minute.wav');
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

            function resetGame(levelToSet) {
                reset(levelToSet);
                octupus.init();
            }

            function reset(levelToSet) {
                gridElement.innerHTML = "";
                octupus.resetControls(levelToSet);
                clearTimeout(timeOut);
            }

            function startNextLevel(levelToSet) {
                reset(levelToSet);
                view.startTheGame();
            }

            function playSound(path) {
                var audioElement = document.createElement('audio');
                audioElement.setAttribute('src', path);
                audioElement.play();
            }

            function setNextLevel() {
                const currentlyLevel = octupus.getLevel();
                if(currentlyLevel == 0) {
                    startNextLevel(1);
                } else if(currentlyLevel == 1) {
                    startNextLevel(2);
                } else {
                    startNextLevel(0);
                }
            }
        },
        buildGame: (Grid, cards) => {
            //improved the performance of 0.312ms to 0.195ms using the fragment
            let fragment = document.createDocumentFragment();
            let numberCardsCount = 0;
            for(let r = 1; r <= Grid.row; r++) {
                let createRow = document.createElement("tr");
                for(let c = 1; c <= Grid.col; c++) {
                    let createdCard = document.createElement("td");
                    let flipContainerElement = document.createElement("div");
                    flipContainerElement.setAttribute("class", "flip-container");
                    let flipperElement = document.createElement("div");
                    flipperElement.setAttribute("class", "flipper");

                    let cardFrontElement = document.createElement("div");
                    cardFrontElement.setAttribute("class", "card_hided");
                    cardFrontElement.setAttribute("id", r+''+c +'-hide');
                    cardFrontElement.innerText = "";
                    flipperElement.appendChild(cardFrontElement);
                    flipContainerElement.appendChild(flipperElement);

                    let cardBackElement = document.createElement("div");
                    cardBackElement.setAttribute("class", "card");
                    cardBackElement.setAttribute("id", r+''+c);
                    cardBackElement.innerText = cards[numberCardsCount];
                    flipperElement.appendChild(cardBackElement);
                    flipContainerElement.appendChild(flipperElement);

                    createdCard.appendChild(flipContainerElement);
                    createRow.appendChild(createdCard);
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
