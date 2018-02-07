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
            //improved the performance of 0.312ms to 0.195ms using the fragment
            let fragment = document.createDocumentFragment();
            let numberCardsCount = 0;
            for(let r = 1; r <= Grid.row; r++) {
                let createRow = document.createElement("tr");
                for(let c = 1; c <= Grid.col; c++) {
                    let createdCol = document.createElement("td");
                    createdCol.setAttribute("class", "card");
                    createdCol.setAttribute("id", r+''+c);
                    createdCol.innerText = cardsArray[numberCardsCount];
                    createRow.appendChild(createdCol);
                    numberCardsCount++;
                }
                
                fragment.appendChild(createRow);
                
            }
            gridElement.appendChild(fragment);
            
  
            gridElement.onclick = function(e) {
                console.log(e.target.id);             
            };

            
            

            // let t0 =  performance.now();

        //     let t1 =  performance.now();
        //  console.log(t1 - t0);
         

            
        }
    }

    //app start here
    octupus.init();
});
