document.addEventListener('DOMContentLoaded', function(){
    // domcontentloaded doesnt wail for other images,subframes to finish loading
    const gridSize=9;
    const solveButton = document.getElementById("solve-btn");
    solveButton.addEventListener('click',solveSudoku);

    const sudokuGrid = document.getElementById("sudoku-grid");
    //create cells and rows
    for(let row=0; row<gridSize; row++){
        const newRow = document.createElement("tr");
        for(let col=0; col<gridSize; col++){
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.className = "cell";
            input.id = `cell-${row}-${col}`;
            cell.appendChild(input);
            newRow.appendChild(cell);
        }
        sudokuGrid.appendChild(newRow);
    }

})

async function solveSudoku(){
    const gridSize = 9;
    const sudokuArray = [];

    //fill sudokuArray with input values from grid
    for(let row=0; row<gridSize; row++){
        sudokuArray[row] = [];
        for(let col=0; col<gridSize; col++){
            const cellId = `cell-${row}-${col}`;
            const cellValue = document.getElementById(cellId).value;
            sudokuArray[row][col] = cellValue !== "" ? parseInt(cellValue) : 0;
        }
    }

    //identify user input cells and mark them
    for(let row=0; row<gridSize; row++){
        for(let col=0;col<gridSize; col++){
            const cellId = `cell-${row}-${col}`;
            const cell = document.getElementById(cellId);

            if(sudokuArray[row][col] !==0){
                cell.classList.add("user-input");
            }
        }
    }

    //solve the sudoku and display the solution
    if(solveSudokuHelper(sudokuArray)){
        for(let row = 0;row<gridSize; row++){
            for(let col=0; col<gridSize; col++){
                const cellId = `cell-${row}-${col}`;
                const cell = document.getElementById(cellId);

                //fill in solved values and apply animation
                if(!cell.classList.contains("user-input")){
                    cell.value = sudokuArray[row][col];
                    cell.classList.add("solved");
                    await sleep(20); //add delay for visualization
                }
            }
        }
    }else{
        alert("No solution exists for the given Sudoku puzzle");
    }
}

function solveSudokuHelper(board){
    const gridSize = 9;

    for(let row = 0; row < gridSize; row++){
        for(let col=0; col<gridSize; col++){
            if(board[row][col] === 0){
                for(let num = 1; num<=9; num++){
                    if(isValidmove(board, row, col, num)){
                        board[row][col] = num;

                        //recursivey try to solve the sudoku
                        if(solveSudokuHelper(board)){
                            return true;  //puzzle solved
                        }
                        board[row][col] = 0; //backtrack
                    }
                }
                return false; //no valid number found
            }
        }
    }
    return true; //all cells filled
}

function isValidmove(board, row, col, num){
    const gridSize=9;

    //check row and column for conflicts
    for(let i=0;i<gridSize; i++){
        if(board[row][i] === num || board[i][col] === num){
            return false;  //conflict found
        }
    }
    //check 3*3 subgrid for conflicts
    const startRow = Math.floor(row/3)*3;
    const startCol = Math.floor(col/3)*3;
    
    for(let i = startRow; i<startRow+3; i++){
        for(let j=startCol; j<startCol+3; j++){
            if(board[i][j] === num){
                return false;  //conflict found
            }
        }
    }

    return true;  //no conflicts found
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));  // return a promise object
    //resolve pauses the execution without interrupting the code's working
}