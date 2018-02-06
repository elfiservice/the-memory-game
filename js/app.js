$(function() {

    let model = {
        Grid: function (row, col) {
            this.row = row,
            this.col = col
        }
    }

    let octupus = {
        getGrid: (row, col) => {
            return new model.Grid(row, col);
        },

        init: () => {
            view.init();
        }
    }

    let view = {
        init: () => {
            //get instance for the Grid
            let Grid = octupus.getGrid(4,4);
            let gridElement = document.getElementById('game_grid');
           
            for(let r = 1; r <= Grid.row; r++) {
                let createRow = document.createElement("tr");
                for(let c = 1; c <= Grid.col; c++) {
                    let createdCol = document.createElement("td");
                    createdCol.innerText = r + "-" + c;
                    createRow.appendChild(createdCol);
                }
                gridElement.appendChild(createRow);
            }
            
        }
    }

    //app start here
    octupus.init();
});
