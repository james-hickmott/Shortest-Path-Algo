import { getHeuristic } from './UtilityFunctions.js';
import { nodePriorityQueue } from './PriorityQueue.js';

///                     ALGO START                  ///

class Algorithm {
    constructor(canvas, openSet = new nodePriorityQueue(), closedSet = [], path = [],
     currentNode = undefined, started = false, finished = false, running = false) {
        this.canvas = canvas;
        this.grid = canvas.grid;
        this.startNode = canvas.startNode;
        this.endNode = canvas.endNode;
        this.openSet = openSet;
        this.closedSet = closedSet;
        this.path = path;
        this.currentNode = currentNode
        this.started = started;
        this.finished = finished;
        this.running = running;
    }

    initialise() {
        // initially we must clear solution
        // to remove anything other than necessary
        // nodes before running
        this.canvas.clearSolution();
        // first node to be evaluated is startNode
        this.currentNode = this.startNode;
        // the algorithm has started and is running
        this.started = true;
        this.running = true;
    }

        /// ALGORTHM CODE GOES HERE ///
}

export class AStar extends Algorithm { // INEHRITANCE
    constructor (canvas, openSet = new nodePriorityQueue(), closedSet = [], path = [],
     currentNode = undefined, started = false, finished = false, running = false) {
        super(canvas, openSet, closedSet, path, currentNode, started, finished, running); // INHERTIANCE
        // AStar open and closed set colours.
        this.openSetColour = '#3867D4';
        this.closedSetColour = '#4CB490';
        this.solutionColour = '#C2D0F5'; // the colour of the shortest path
    }

    initialise() {
        super.initialise();  // POLMORPHISM
        this.openSet.add(this.startNode, this.startNode.f) // add startnode to openSet initially
        // Assign each node necessary attributes
        for (let cols of this.grid) {
            for (let rows of cols) {
                if (rows.isWall == false) {
                    rows.f = 0; // g score + h score
                    rows.g = 0; // distance from start
                    rows.h = 0; // distance to end
                    rows.previous = undefined;
                } else {
                    // because high f score these
                    // wont be evaluated
                    rows.f = 999;
                    rows.g = 999;
                    rows.h = 999;
                    rows.previous = undefined;
                }
            }
        }
        // evaluate currentNode
        this.currentNode.h = getHeuristic(this.currentNode, this.endNode); 
        this.currentNode.f = this.currentNode.h;
    }

    getCostOfNeighbours(node) {
        for (let n of node.neighbours) {
            if ((n.isWall == false) && (this.openSet.has(n))&&
            ((((node.g + getHeuristic(node, n))) + (getHeuristic(n, this.endNode))) < n.f)) {
                // cost of neighbour is cost of this + 1
                // because eahc node is 1 apart
                n.g = node.g + getHeuristic(node, n);
                n.h = getHeuristic(n, this.endNode);
                n.f = n.g + n.h;
                n.previous = node; // required for drawing the shortest path
            }
            else if ((n.isWall == false)&&(!this.closedSet.includes(n))&&(!this.openSet.has(n))) {
                n.g = node.g + getHeuristic(node, n);
                n.h = getHeuristic(n, this.endNode);
                n.f = n.g + n.h;
                n.previous = node;
            }
        }
    }

    runAlgorithm() {
        // beacuse we are evaluating currentNode
        // we put it in closed set and remove it
        // from open set
        this.openSet.remove(this.currentNode);
        this.closedSet.push(this.currentNode);
        // before we move add current node to closed set
        // and remove current node from open set
        this.getCostOfNeighbours(this.currentNode);
        // get the cost of this nodes neighbours
        for (let i of this.currentNode.neighbours) {
            if (i.isWall == false &&
                (!this.closedSet.includes(i)) &&
                (!this.openSet.has(i))){
                this.openSet.add(i, i.f);
            }
        }
        //add neighbours of current node to the open set

        this.currentNode = this.openSet.get;
        // loop through until currentNode is the endNode

        // set colour of open set nodes
        for (let i of this.openSet.data()) {
            if (!(i[0].isStartNode || i[0].isEndNode)) {
                i[0].colour = this.openSetColour;
            }
        }
        // set colour of closed set nodes
        for (let i of this.closedSet) {
            if (!(i.isStartNode || i.isEndNode)) {
            i.colour = this.closedSetColour;
            }
        }
        // if we find shortest path backtrack and draw it
        if (this.currentNode == this.endNode) {
            console.log('FOUND SHORTEST PATH');
            var tempry = this.currentNode;
            this.path.push(tempry);
            // BACKTRACKING TO START
            while (tempry.previous) {
                this.path.push(tempry.previous);
                tempry = tempry.previous;
            }
            //
            for (let i of this.path) {
                // draw the shrotest path
                i.colour = this.solutionColour;
            }
            // clear the now unneeded attrbiutes
            // so ready for another algorithm
            for (let i of this.grid) {
                for (let j of i) {
                    delete j.f;
                    delete j.g;
                    delete j.h;
                    delete j.previous;
                }
            }
            // no longer running so disable
            this.finished = true;
            this.running = false;
            this.canvas.drawCanvas();
        }
        // draw each time an iteration is run
        this.canvas.drawCanvas();
        /// END OF LOOP
    }
}

/// INITIALISING GREEDY ///

export class Greedy extends Algorithm { // INHERITANCE
    constructor (canvas, openSet = new nodePriorityQueue(), closedSet = [], path = [], started = false, finished = false, running = false) {
        super(canvas, openSet, closedSet, path, started, finished, running); // INHERTIANCE
        // greedy needs open, and closed set
        this.openSetColour = '#3867D4';
        this.closedSetColour = '#4CB490';
        this.solutionColour = '#C2D0F5'; // shortest path colour
    }

    initialise() {
        super.initialise();  // POLYMORPHISM
        // assign necessary variable to nodes in grid
        for (let cols of this.grid) {
            for (let rows of cols) {
                if (rows.isWall == false) {
                    rows.h = getHeuristic(rows, this.endNode);
                    rows.hasBeenInClosedSet = false;
                    rows.hasBeenInOpenSet = false;
                    rows.previous = undefined;
                } else {
                    rows.h = 999; // this means walls wont be evaluated
                    rows.hasBeenInClosedSet = undefined;
                    rows.hasBeenInOpenSet = undefined;
                    rows.previous = undefined;
                }
            }
        }
        this.openSet.add(this.startNode, this.startNode.h)
        this.currentNode.hasBeenInOpenSet = true;
    }


    runAlgorithm() {
        // get smallest h cost from openSet
        this.currentNode = this.openSet.get;
        // move current node into open set and out of closed set
        this.openSet.remove(this.currentNode);
        this.closedSet.push(this.currentNode);
        this.currentNode.hasBeenInClosedSet = true;
        for (let i of this.currentNode.neighbours) {
            if ( (i != this.currentNode.previous)&&(!(i.previous))) {
                // this is required for backtracking and getting shortest path
                i.previous = this.currentNode;
            }
            if (i == this.endNode) {
                // if done then backtrack and make shortest path
                console.log('FOUND SHORTEST PATH');
                let tempry = this.currentNode;
                this.path.push(tempry);
                while ((tempry.previous)){
                    this.path.push(tempry.previous);
                    tempry = tempry.previous;
                }
                this.path.push(this.endNode);
                console.log('DONE');

                // delete the attributes initialised
                for (let i of this.grid) {
                    for (let j of i) {
                        delete j.h;
                        delete j.previous;
                        delete j.hasBeenInClosedSet;
                        delete j.hasBeenInOpenSet;
                    }
                }

                this.canvas.drawCanvas();
                // no longer running
                this.finished = true;
                this.running = false;
            }
            // add neighbours to open set
            else if ((i.isWall == false)&&(i.hasBeenInOpenSet == false)&&(i.hasBeenInClosedSet == false)) {
                this.openSet.add(i, i.h);
                i.hasBeenInOpenSet = true;
                // console.log(i);
            }
        }

        // SETTING COLOURS, open set, closed set and path
        for (let i of this.openSet.data()) {
            if ((i[0].isStartNode == false)&&(i[0].isEndNode == false)) {
                i[0].colour = this.openSetColour;
            }
        }
        for (let i of this.closedSet) {
            if ((i.isStartNode == false)&&(i.isEndNode == false)) {
                i.colour = this.closedSetColour;
            }
        }
        for (let i of this.path) {
            i.colour = this.solutionColour;
        }
        //
        // draw all nodes each frame 
        this.canvas.drawCanvas();

    }
}


///                         END GREEDY BEST-FIRST SEARCH                  ///