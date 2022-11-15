class Maze {
    constructor(canvas) {
        this.canvas = canvas;
    }

    initialise() {
        this.canvas.clearCanvas();
    }
}

export class binaryTreeMaze extends Maze {
    constructor(canvas) {
        super(canvas); // INHERITANCE
        this.count = 0;
        this.elements = [];
        this.elementsLength;
    }
    /// INITIALISE ///
    initialise() {
        super.initialise(); // POLYMORPHISM
        for (let i of this.canvas.grid) {
            for (let j of i) {
                if ((j.ordinates[0] == 0) || (j.ordinates[1] == 0)) {
                    // pass
                }
                // turn whole row into walls if
                // rows y co-ordiantes is even and not first element
                else if ((j.ordinates[1]-1) % 2 == 0) {
                    j.colour = 'black';
                    j.isWall = true;
                }
                // if a node is a cell (must be clear, determined by algorithm)
                // then give it north and west attributes
                if (((j.ordinates[1] % 2) == 0)&&((j.ordinates[0]%2) == 0)&&(j.ordinates[0] != 0)&&(j.ordinates[1] != 0)) {
                    j.north = this.canvas.grid[j.ordinates[0]][j.ordinates[1]-1];
                    j.west = this.canvas.grid[j.ordinates[0]-1][j.ordinates[1]];
                    this.elements.push(j);
                }
            }
        }
        this.elementsLength = this.elements.length;
    }

    generate() {
        let el = this.elements.pop();
        // randomly select a north or west neighbour to turn into a wall or clear
        if (Math.random() < 0.5) {
            el.north.colour = this.canvas.clearColour;
            el.north.isWall = false;
            el.west.colour = 'black';
            el.west.isWall = true;
            this.count++;
        } else {
            el.north.colour = 'black';
            el.north.isWall = true;
            el.west.colour = this.canvas.clearColour;
            el.west.isWall = false;
            this.count++;
        }
        // assign this back into the canvas
        this.canvas.grid[el.ordinates[0]][el.ordinates[1]] = el;
        if (this.count < this.elementsLength) {
            this.generate();  /// RECURSION ///
        } else {
            return;
        }

    }
    finish() {
        // delete the attributes used after we have generated
        for (let i of this.canvas.grid) {
            for (let j of i) {
                delete j.north;
                delete j.west;
            }
        }
        this.canvas.drawCanvas(); // draw canvas

    }
}


/// vertical maze

export class verticalMaze extends Maze {
    constructor(canvas) {
        super(canvas); // INHERITANCE
    }
    
    /// making every other column a wall
    initialise() {
        super.initialise(); // POLYMORPHISM
        for (let i = 0; i < this.canvas.grid.length; i++) {
            if ((i+1) % 2 == 0) {
                for (let node of this.canvas.grid[i]) {
                    node.colour = 'black';
                    node.isWall = true;
                }
            }
        }
    }

    generate() {
        // randomly picka  cell in the wall columns and make this cell clear
        for (let i = 0; i < this.canvas.grid.length; i++) {
            if (((i+1) % 2 == 0) && (i != 0) && (i != this.canvas.grid.length-1)) {
                let randum = Math.floor(Math.random()*this.canvas.grid[i].length);
                while ((randum == 0) || (randum == i.length-1)) {
                    randum = Math.floor(Math.random()*this.canvas.grid[i].length);
                }
                this.canvas.grid[i][randum].colour = this.canvas.clearColour;
                this.canvas.grid[i][randum].isWall = false;
            }
        }
    }

    finish() {
        this.canvas.drawCanvas(); // draw canvas
    }
}



/// sidewinder with flooding


export class sideWinderMaze extends Maze {
    constructor(canvas) {
        super(canvas); // INHERTIANCE
        this.currentRunSet = [];
        this.tempGrid;
    }

    initialise() {
        super.initialise(); // POLYMORPHISM
        // make temporary grid copy
        this.tempGrid = new Array(this.canvas.rows)
        for (let row = 0; row < this.tempGrid.length; row++) {
            this.tempGrid[row] = new Array(this.canvas.cols);
        }
        // make grid full of walls except top row
        for (let i of this.canvas.grid) {
            for (let j of i) {
                if (j.ordinates[1] != 0) {
                    j.colour = 'black';
                    j.isWall = true;
                }
                // clear each cell for algorithm
                if ((j.ordinates[1] != 0)&&((j.ordinates[0] % 2) == 0)&&((j.ordinates[1]%2) == 0)) {
                    j.colour = this.canvas.clearColour;
                    j.isWall = false;
                    j.north = this.canvas.grid[j.ordinates[0]][j.ordinates[1]-1]
                    if (j.ordinates[0] != this.canvas.grid.length-1) {
                        j.east = this.canvas.grid[j.ordinates[0]+1][j.ordinates[1]]
                    }
                }
            }
        }
        /// turn grid into a tempGrid with index1 row1 then index2 row2 and so on... instead of col1 then col2
        for (let i = 0; i < this.canvas.rows; i++) {
            for (let j = 0; j < this.canvas.cols; j++) {
                this.tempGrid[i][j] = this.canvas.grid[j][i];
            }
        }
    }

    generate() {
        for (let i of this.tempGrid) {
            for (let j of i) {
                if ((j.ordinates[1] != 0)&&((j.ordinates[0] % 2) == 0)&&(j.ordinates[1]%2 == 0)) {
                    // if not in runSet then add in runSet
                    if (!(this.currentRunSet).includes(j)) {
                        this.currentRunSet.push(j);
                    }

                    // randomly carve east if possible
                    let carveEast = Math.random()
                    if ((carveEast < 0.5)&&(j.east != undefined)) {
                        j.east.colour = this.canvas.clearColour;
                        j.east.isWall = false;
                    } else {
                        // get random element from run set
                        let randomElement = this.currentRunSet[Math.floor((Math.random()*this.currentRunSet.length))];
                        // carve north with this element
                        randomElement.north.colour = this.canvas.clearColour;
                        randomElement.north.isWall = false;
                        this.currentRunSet.splice(0, this.currentRunSet.length);
                    }
                }
            }
        }
    }

    finish() {
        // delete the made attributes
        for (let i = 0; i < this.canvas.cols; i++) {
            for (let j = 0; j < this.canvas.rows; j++) {
                this.canvas.grid[i][j] = this.tempGrid[j][i];
                delete this.canvas.grid[i][j].north;
                delete this.canvas.grid[i][j].east;
            }
        }
        this.canvas.drawCanvas(); // draw canvas
    }
}
