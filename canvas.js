export class Canvas {
  constructor(cols, rows) {
      this.canvas = document.createElement('CANVAS');
      this.ctx = (this.canvas).getContext('2d');
      this.cols = cols;
      this.rows = rows;
      this.diagonalLines = false;
      this.gridLines = false;
      this.clearColour = 'rgb(61, 66, 82)';
      this.startNodeColour = '#39B57B';
      this.endNodeColour = 'orange';
      this.startNode = undefined;
      this.endNode = undefined;
      this.nodeSize = ((this.canvas).width)/this.cols;
      this.grid;
      
      this.clicking = false;
      this.lastNodePos;
      this.currentNodePos;
      this.clearAlgo = false;
      this.drawMode = 'brush';
      this.brushSize = 1;
      this.eraserSize = 2;
      this.neiList = new Set();

      // adding the canvas element to the document
      document.body.appendChild(this.canvas);
  }

  makeGrid() {
    // reset start and end node
    this.startNode = undefined;
    this.endNode = undefined;
    this.grid = new Array(this.cols);
      for (let i = 0; i < this.cols; i++) {
          this.grid[i] = new Array(this.rows);
          for (let j = 0; j < this.rows; j++) {
              this.grid[i][j] = new Node(((this.canvas).width/this.cols)*i, ((this.canvas).height/this.rows)*j,
              i, j, 'grey', this.clearColour, this.nodeSize);
          }
      }
  }

  drawCanvas() {
    // clear the current canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (let cols of this.grid) {
          for (let node of cols) {
            // for each node draw a square
              this.ctx.beginPath();
              this.ctx.rect(node.x, node.y, node.size, node.size);
              this.ctx.fillStyle = node.colour;
              this.ctx.fill();
              if (this.gridLines == false) {
                this.ctx.strokeStyle = node.colour;
                this.ctx.stroke();
              } else {
                  this.ctx.lineWidth = this.nodeSize/20;
                  this.ctx.strokeStyle = 'grey';
                  this.ctx.stroke();
              }
          }
      }
  }

  resize() {
    // this will get the smallest of the two:
    // the windows width and the windows height
    if (window.innerWidth > window.innerHeight) {
      let ratio = this.cols/this.rows;
      if (this.canvas.height != window.innerHeight) {
        this.canvas.height = window.innerHeight;
        this.canvas.width = this.canvas.height * ratio;
      }
    }
    else if (window.innerWidth < window.innerHeight) {
      let ratio = this.rows/this.cols;
      if (this.canvas.width != window.innerWidth) {
        this.canvas.width = window.innerWidth;
        this.canvas.height = this.canvas.width * ratio;
      }
    }
    this.nodeSize = (this.canvas).width/this.cols; //refresh node size
    
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        // change attributes of nodes after page resize so
        // canvas interaction is still functional
          this.grid[i][j].x = this.canvas.width/this.cols*i;
          this.grid[i][j].y = this.canvas.height/this.rows*j;
          this.grid[i][j].gridIndexX = i;
          this.grid[i][j].gridIndexY = j;
          this.grid[i][j].size = this.nodeSize;
          this.grid[i][j].ordinates = [i, j];

      }
    }
    // clear the current canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawCanvas();
    this.updateAllNeighbours();
  }
  
  updateNeighbours(node) {
    // delete all current neighbours of node
    // this will check if a nodes position is in a corner
    // on an edge, or neither of those, then get their
    // specific neighbours
      node.neighbours.splice(0, node.neighbours.length);
      // top left corner
      if (node.gridIndexX == 0 && node.gridIndexY == 0) {
        node.neighbours.push(this.grid[node.gridIndexX+1][node.gridIndexY], this.grid[node.gridIndexX][node.gridIndexY+1]);
        if (this.diagonalPaths == true) {
          node.neighbours.push(this.grid[node.gridIndexX+1][node.gridIndexY+1]);
        }
      }
      //bottom left corner
      else if (node.gridIndexX == 0 && node.gridIndexY == this.rows-1) {
        node.neighbours.push(this.grid[node.gridIndexX+1][node.gridIndexY], this.grid[node.gridIndexX][node.gridIndexY-1]);
        if (this.diagonalPaths == true) {
          node.neighbours.push(this.grid[node.gridIndexX+1][node.gridIndexY-1]);
        }
      }
      // top right corner
      else if (node.gridIndexX == this.cols-1 && node.gridIndexY == 0) {
        node.neighbours.push(this.grid[node.gridIndexX][node.gridIndexY+1], this.grid[node.gridIndexX-1][node.gridIndexY]);
        if (this.diagonalPaths == true) {
          node.neighbours.push(this.grid[node.gridIndexX-1][node.gridIndexY+1]);
        }
      }
      // bottom right corner
      else if (node.gridIndexX == this.cols-1 && node.gridIndexY == this.rows-1) {
        node.neighbours.push(this.grid[node.gridIndexX-1][node.gridIndexY], this.grid[node.gridIndexX][node.gridIndexY-1]);
        if (this.diagonalPaths == true) {
          node.neighbours.push(this.grid[node.gridIndexX-1][node.gridIndexY-1]);
        }
      }
      // left edge
      else if (node.gridIndexX == 0) {
        node.neighbours.push(this.grid[node.gridIndexX+1][node.gridIndexY], this.grid[node.gridIndexX][node.gridIndexY+1],
           this.grid[node.gridIndexX][node.gridIndexY-1]);
        if (this.diagonalPaths == true) {
          node.neighbours.push(this.grid[node.gridIndexX+1][node.gridIndexY+1], this.grid[node.gridIndexX+1][node.gridIndexY-1]);
        }
      }
      // right edge
      else if (node.gridIndexX == this.cols-1) {
        node.neighbours.push(this.grid[node.gridIndexX-1][node.gridIndexY],this.grid[node.gridIndexX][node.gridIndexY-1],
           this.grid[node.gridIndexX][node.gridIndexY+1]);
        if (this.diagonalPaths == true) {
          node.neighbours.push(this.grid[node.gridIndexX-1][node.gridIndexY-1], this.grid[node.gridIndexX-1][node.gridIndexY+1]);
        }
      }
      // top edge
      else if (node.gridIndexY == 0) {
        node.neighbours.push(this.grid[node.gridIndexX-1][node.gridIndexY], this.grid[node.gridIndexX][node.gridIndexY+1],
           this.grid[node.gridIndexX+1][node.gridIndexY]);
        if (this.diagonalPaths == true) {
        node.neighbours.push(this.grid[node.gridIndexX-1][node.gridIndexY+1], this.grid[node.gridIndexX+1][node.gridIndexY+1]);
        }
      }
      // bottom edge
      else if (node.gridIndexY == this.rows-1) {
        node.neighbours.push(this.grid[node.gridIndexX-1][node.gridIndexY], this.grid[node.gridIndexX][node.gridIndexY-1],
           this.grid[node.gridIndexX+1][node.gridIndexY]);
        if (this.diagonalPaths == true) {
          node.neighbours.push(this.grid[node.gridIndexX+1][node.gridIndexY-1], this.grid[node.gridIndexX-1][node.gridIndexY-1]);
        }
      }
      // centre of canvas
      else {
        node.neighbours.push(
          this.grid[node.gridIndexX-1][node.gridIndexY], this.grid[node.gridIndexX][node.gridIndexY-1],
          this.grid[node.gridIndexX+1][node.gridIndexY], this.grid[node.gridIndexX][node.gridIndexY+1]);
        if (this.diagonalPaths == true) {
          node.neighbours.push(
              this.grid[node.gridIndexX+1][node.gridIndexY-1], this.grid[node.gridIndexX+1][node.gridIndexY+1],
              this.grid[node.gridIndexX-1][node.gridIndexY-1], this.grid[node.gridIndexX-1][node.gridIndexY+1]);
        }
      }
  }

  // same as updateNeighbours()
  // but it adds to a set instead
  // and includes diagonals
  addNeighbours(node) {
    if (node.gridIndexX == 0 && node.gridIndexY == 0) {
        this.neiList.add(this.grid[node.gridIndexX+1][node.gridIndexY]);
        this.neiList.add(this.grid[node.gridIndexX][node.gridIndexY+1]);
        this.neiList.add(this.grid[node.gridIndexX+1][node.gridIndexY+1]);
    }
    else if (node.gridIndexX == 0 && node.gridIndexY == this.rows-1) {
        this.neiList.add(this.grid[node.gridIndexX+1][node.gridIndexY]);
        this.neiList.add(this.grid[node.gridIndexX][node.gridIndexY-1]);
        this.neiList.add(this.grid[node.gridIndexX+1][node.gridIndexY-1]);
    }
    else if (node.gridIndexX == this.cols-1 && node.gridIndexY == 0) {
        this.neiList.add(this.grid[node.gridIndexX][node.gridIndexY+1]);
        this.neiList.add(this.grid[node.gridIndexX-1][node.gridIndexY]);
        this.neiList.add(this.grid[node.gridIndexX-1][node.gridIndexY+1]);
    }
    else if (node.gridIndexX == this.cols-1 && node.gridIndexY == this.rows-1) {
        this.neiList.add(this.grid[node.gridIndexX-1][node.gridIndexY]);
        this.neiList.add(this.grid[node.gridIndexX][node.gridIndexY-1]);
        this.neiList.add(this.grid[node.gridIndexX-1][node.gridIndexY-1]);
    }
    else if (node.gridIndexX == 0) {
        this.neiList.add(this.grid[node.gridIndexX+1][node.gridIndexY]);
        this.neiList.add(this.grid[node.gridIndexX][node.gridIndexY+1]);
        this.neiList.add(this.grid[node.gridIndexX][node.gridIndexY-1]);
        this.neiList.add(this.grid[node.gridIndexX+1][node.gridIndexY+1]);
        this.neiList.add(this.grid[node.gridIndexX+1][node.gridIndexY-1]);
    }
    else if (node.gridIndexX == this.cols-1) {
        this.neiList.add(this.grid[node.gridIndexX-1][node.gridIndexY]);
        this.neiList.add(this.grid[node.gridIndexX][node.gridIndexY-1]);
        this.neiList.add(this.grid[node.gridIndexX][node.gridIndexY+1]);
        this.neiList.add(this.grid[node.gridIndexX-1][node.gridIndexY-1]);
        this.neiList.add(this.grid[node.gridIndexX-1][node.gridIndexY+1]);
    }
    else if (node.gridIndexY == 0) {
        this.neiList.add(this.grid[node.gridIndexX-1][node.gridIndexY]);
        this.neiList.add(this.grid[node.gridIndexX][node.gridIndexY+1]);
        this.neiList.add(this.grid[node.gridIndexX+1][node.gridIndexY]);
        this.neiList.add(this.grid[node.gridIndexX-1][node.gridIndexY+1]);
        this.neiList.add(this.grid[node.gridIndexX+1][node.gridIndexY+1]);
    }
    else if (node.gridIndexY == this.rows-1) {
        this.neiList.add(this.grid[node.gridIndexX-1][node.gridIndexY]);
        this.neiList.add(this.grid[node.gridIndexX][node.gridIndexY-1]);
        this.neiList.add(this.grid[node.gridIndexX+1][node.gridIndexY]);
        this.neiList.add(this.grid[node.gridIndexX+1][node.gridIndexY-1]);
        this.neiList.add(this.grid[node.gridIndexX-1][node.gridIndexY-1]);
    }
    else {
        this.neiList.add(this.grid[node.gridIndexX-1][node.gridIndexY]);
        this.neiList.add(this.grid[node.gridIndexX][node.gridIndexY-1]);
        this.neiList.add(this.grid[node.gridIndexX+1][node.gridIndexY]);
        this.neiList.add(this.grid[node.gridIndexX][node.gridIndexY+1]);
        this.neiList.add(this.grid[node.gridIndexX+1][node.gridIndexY-1]);
        this.neiList.add(this.grid[node.gridIndexX+1][node.gridIndexY+1]);
        this.neiList.add(this.grid[node.gridIndexX-1][node.gridIndexY-1]);
        this.neiList.add(this.grid[node.gridIndexX-1][node.gridIndexY+1]);
    }
  }
  // this is for getting the nodes to be changed
  // with brush/eraser where levels
  // is the number of the slider
  getNeighbours(node, levels) {
    let temp = undefined;
    if (levels == 0) {
      this.neiList.add(node);
      temp = this.neiList;
      this.neiList = new Set();
      return temp;
    }
    this.addNeighbours(node);
    levels--;
    if (levels == 0) {
      temp = this.neiList;
      this.neiList = new Set();
      return temp;
    }
    ///
    while (1) {
      temp = Array.from(this.neiList);
      for (let i of temp) {
        this.addNeighbours(i);
      }
      levels--;
      if (levels == 0) {
        temp = this.neiList;
        this.neiList = new Set();
        return temp;
      }
    }
  }

  updateAllNeighbours() {
    // iterates through every node in the grid and updates their neighbours
    for (let cols of this.grid) {
        for (let node of cols) {
            this.updateNeighbours(node);
        }
    }
  }

  clearCanvas() {
    // clears the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.makeGrid(); // make a new grid
    this.drawCanvas(); // draw the new grid
  }

  mouseMove(event) {
    // Gets CSS pos, and width/height
    var cRect = this.canvas.getBoundingClientRect();
    var cursorX = event.clientX - cRect.left; // get mouse X position
    var cursorY = event.clientY - cRect.top; // get mouse Y position
    // console.log(event.pageX, event.clientX, event.screenX) this will all log the same thing}
    if (this.clicking == true) {
        this.whileMousePressed(cursorX, cursorY)
    }
  }


  mouseDown(event) {
    // Gets CSS pos, and width/height
    var cRect = this.canvas.getBoundingClientRect();
    // get the node that the mouse is currently hovering over
    let clickedNode = this.grid[(Math.floor((event.clientX - cRect.left)/(this.canvas.width/this.cols)))]
    [(Math.floor((event.clientY - cRect.top)/(this.canvas.height/this.rows)))];
    if (clickedNode.isStartNode || clickedNode.isEndNode) {
      // run as if it was clicking on this node
      this.mouseClicked(event.clientX - cRect.left, event.clientY - cRect.top);
    }
    else if ((this.startNode) && (this.endNode) && (this.drawMode == 'brush')) {
      this.clicking = true;
      // Gets CSS pos, and width/height
      let cRect = this.canvas.getBoundingClientRect();
      this.lastNodePos = this.grid[(Math.floor((event.clientX - cRect.left)/(this.canvas.width/this.cols)))]
      [(Math.floor((event.clientY - cRect.top)/(this.canvas.height/this.rows)))].ordinates;
      this.drawBrush(event.clientX - cRect.left, event.clientY - cRect.top);
    } 
    else if ((this.startNode) && (this.endNode) && (this.drawMode == 'eraser')) {
      this.clicking = true;
      // Gets CSS pos, and width/height
      let cRect = this.canvas.getBoundingClientRect();
      this.lastNodePos = this.grid[(Math.floor((event.clientX - cRect.left)/(this.canvas.width/this.cols)))]
      [(Math.floor((event.clientY - cRect.top)/(this.canvas.height/this.rows)))].ordinates;
      this.drawEraser(event.clientX - cRect.left, event.clientY - cRect.top);
    } 
    else {
      this.mouseClicked(event.clientX - cRect.left, event.clientY - cRect.top);
    }
  }

  mouseUp() {
      // when mouse is no longer pressed
      this.clicking = false;
  }

  whileMousePressed(mouseX, mouseY) {
    // the nodes x grid index
    let xElementPos = Math.floor(mouseX/(this.canvas.width/this.cols));
    // the nodes y grid index
    let yElementPos = Math.floor(mouseY/(this.canvas.height/this.rows));
    // get the node we are hovering over
    this.currentNodePos = this.grid[xElementPos][yElementPos].ordinates;
    if ((this.currentNodePos != this.lastNodePos)&&(this.drawMode == 'brush')) {
        this.drawBrush(mouseX, mouseY);
        this.lastNodePos = this.currentNodePos;
    } else if ((this.currentNodePos != this.lastNodePos)&&(this.drawMode == 'eraser')) {
      this.drawEraser(mouseX, mouseY);
      this.lastNodePos = this.currentNodePos;
    }
  }

  drawBrush(MouseX, MouseY) {
      // the nodes x grid index
    let xElementPos = Math.floor(MouseX/(this.canvas.width/this.cols));
      // the nodes y grid index
    let yElementPos = Math.floor(MouseY/(this.canvas.height/this.rows));
    // get the node we are clicking
    let nodeWeAreClicking = this.grid[xElementPos][yElementPos];
    if ((nodeWeAreClicking.isStartNode)||(nodeWeAreClicking.isEndNode)) {
      this.mouseClicked(MouseX, MouseY)
    }
    if ((nodeWeAreClicking.isWall == false)&&(nodeWeAreClicking.colour != this.clearColour)) {
      // if we are clicking on a node that is part of
      // showing the shortest path then
      // resest the shortest path so as to not
      // interfere with these nodes
        this.clearSolution();
        this.clearAlgo = true;
    }
    else if (!(nodeWeAreClicking.isStartNode)&&(!(nodeWeAreClicking.isEndNode))) {
      nodeWeAreClicking.colour = 'black';
      nodeWeAreClicking.isWall = true;
      for (let i of this.getNeighbours(nodeWeAreClicking, this.brushSize)) {
        if (!(i.colour == this.clearColour || i.colour == 'black' || i.colour == this.startNodeColour || i.colour == this.endNodeColour)) {
          // if we try to draw a node that is
          // part of the solution with the
          // brush then the solution is cleared
          this.clearSolution();
          this.clearAlgo = true;
        }
        if ((i.isStartNode == false)&&(i.isEndNode == false)) {
          i.colour = 'black';
          i.isWall = true;
        }
      }
    }
    this.drawCanvas();
  }

  drawEraser(MouseX, MouseY) {
      // the nodes x grid index
    let xElementPos = Math.floor(MouseX/(this.canvas.width/this.cols));
      // the nodes y grid index
    let yElementPos = Math.floor(MouseY/(this.canvas.height/this.rows));
      // get the node we are clicking
    let nodeWeAreClicking = this.grid[xElementPos][yElementPos];
    if ((nodeWeAreClicking.isStartNode)||(nodeWeAreClicking.isEndNode)) {
      this.mouseClicked(MouseX, MouseY)
    }
    if ((nodeWeAreClicking.isWall == false)&&(nodeWeAreClicking.colour != this.clearColour)) {
      // if we are clicking on a node that is part of
      // showing the shortest path then
      // resest the shortest path so as to not
      // interfere with these nodes
        this.clearSolution();
        this.clearAlgo = true;
    }
    else if (!(nodeWeAreClicking.isStartNode)&&(!(nodeWeAreClicking.isEndNode))) {
      nodeWeAreClicking.colour = this.clearColour;
      nodeWeAreClicking.isWall = false;
      for (let i of this.getNeighbours(nodeWeAreClicking, this.eraserSize)) {
        if (!(i.colour == this.clearColour || i.colour == 'black' || i.colour == this.startNodeColour || i.colour == this.endNodeColour)) {
          // if we try to draw a node that is
          // part of the solution with the
          // eraser then the solution is cleared
          this.clearSolution();
          this.clearAlgo = true;
        }
        if ((i.isStartNode == false)&&(i.isEndNode == false)) {
          i.colour = this.clearColour;
          i.isWall = false;
        }
      }
    }
    this.drawCanvas();
  }

  mouseClicked(mouseX, mouseY) {
      // the nodes x grid index
    let xElementPos = Math.floor(mouseX/(this.canvas.width/this.cols));
      // the nodes y grid index
    let yElementPos = Math.floor(mouseY/(this.canvas.height/this.rows));
      // get the node we are clicking
    let nodeWeAreClicking = this.grid[xElementPos][yElementPos];
    // console.log(nodeWeAreClicking.colour.map(e => e == 255).reduce((prev, e) => prev && e));
    if ((nodeWeAreClicking.isWall == false)&&(nodeWeAreClicking.colour != this.clearColour)&&(!(nodeWeAreClicking.isStartNode || nodeWeAreClicking.isEndNode))
    ||(nodeWeAreClicking.colour = 'blue')) {
      // if we are clicking on a node that is part of
      // showing the shortest path then
      // resest the shortest path so as to not
      // interfere with these nodes     
      this.clearSolution();
      this.clearAlgo = true;
    }
    if ((nodeWeAreClicking.colour == this.clearColour)&&(!(this.startNode))&&nodeWeAreClicking.isStartNode == false) {
      // make node we are clicking into startnode
        nodeWeAreClicking.colour = this.startNodeColour;
        nodeWeAreClicking.isStartNode = true;
        this.startNode = nodeWeAreClicking;
    }

    else if (nodeWeAreClicking.isStartNode == true) {
      //  if we are clicking startnode then make it clear
        nodeWeAreClicking.colour = this.clearColour;
        nodeWeAreClicking.isStartNode = false;
        this.startNode = undefined;
    }

    // console.log("Hello"); cant have this here between the if and else if statements because its not allowed

    else if ((!(this.endNode) && (nodeWeAreClicking.colour == this.clearColour))) {
        // make node we are clicking into end node
        nodeWeAreClicking.colour = this.endNodeColour;
        nodeWeAreClicking.isEndNode = true;
        this.endNode = nodeWeAreClicking;
    }

    else if (nodeWeAreClicking.isEndNode == true) {
      // if we are clicking endnode then make this clear
        nodeWeAreClicking.colour = this.clearColour;
        nodeWeAreClicking.isEndNode = false;
        this.endNode = undefined;
    }

    this.drawCanvas();
  }

  clearSolution() {
    for (let i of this.grid) {
      for (let j of i) {
        // remove all nodes that are part of a solution
        if ((j.isWall == false)&&(j.isStartNode == false)&&(j.isEndNode == false)) {
          j.colour = this.clearColour;
        }
        // resset colours of basic nodes
        else if (j.isStartNode) {
          j.colour = this.startNodeColour;
        }
        else if (j.isEndNode) {
          j.colour = this.endNodeColour;
        }
        else if (j.isWall) {
          j.colour = 'black';
        }
      }
    }
  }

  clearCanvas() {
    // clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // clear solutions
    this.clearSolution();
    // make a new grid
    this.makeGrid();
    // draw the canvas
    this.drawCanvas();
    // update all nodes nieghbours
    this.updateAllNeighbours(); 
    // this is so that when an algorithm is called
    // the algorith can run properly
  }
}

// node class is only used in canvas.js
// so decided to bring the class in as it is short
// these are attributes required for each node object
class Node {
  constructor(x, y, gridIndexX, gridIndexY, stroke = 'black', colour = 'white', size = 10) {
    this.x = x;
    this.y = y;
    this.gridIndexX = gridIndexX;
    this.gridIndexY = gridIndexY;
    this.ordinates = [gridIndexX, gridIndexY];
    this.stroke = stroke;
    this.colour = colour;
    this.neighbours = [];
    this.isStartNode = false;
    this.isEndNode = false;
    this.isWall = false;
    this.size = size;
  }
}