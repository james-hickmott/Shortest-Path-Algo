import { Canvas } from './canvas.js';
import { AStar, Greedy } from './Algorithms.js';
import { binaryTreeMaze, verticalMaze, sideWinderMaze } from './mazeGenerators.js';
import { Minimap } from './Minimap.js';
import { nodeInfo } from './node_info.js';


// decalring the canvas for nodes and drawing
var canvas1 = new Canvas(100, 100);
canvas1.makeGrid();
canvas1.drawCanvas();
canvas1.updateAllNeighbours();
canvas1.resize();
canvas1.canvas.id = 'canvasID';

var overlay = document.getElementById('overlay');
var yesButton = document.getElementById('wantsMinimaps');
var noButton = document.getElementById('doesNotWantMinimaps');

var buttonsContainer = document.getElementById('buttonsContainer');

yesButton.onclick = function() {
    userDoesWantMinimaps();
    overlay.style.display = 'none';
}

noButton.onclick = function() {
    userDoesNotWantMinimaps();
    overlay.style.display = 'none';
}

/// onresize add a button that changes the grid-auto-rows size of the #buttonsContainer



function userDoesWantMinimaps() { // if they want node info and minimap
    // declaring the mini-map
    var canvasMinimap = new Minimap(canvas1, 310, 310, 100, 100);

    // declaring the nodeMap
    var nodeMap = new nodeInfo(canvas1, 310);

    // adding the event listeners to canvas1 so that
    // the user can draw brush/erase
    // and so nodeMap can update nodes.
    canvas1.canvas.addEventListener("mousedown", function(event) {canvas1.mouseDown(event);});
    canvas1.canvas.addEventListener("mouseup", function() {canvas1.mouseUp()});
    canvas1.canvas.addEventListener("mousemove", function (event) {
        canvas1.mouseMove(event);
        nodeMap.getNodeList(event);
    });
    canvas1.canvas.addEventListener('mouseout', function () {canvas1.mouseUp()});

    // canvas minimap needs cursor information of the canvas to adding event listeners
    document.addEventListener("mousemove", function (event) {canvasMinimap.getData(event)});
    document.addEventListener("mousedown", function (event) {canvasMinimap.getData(event)});

    // for resizing the page
    let t = window.innerWidth-window.innerHeight.toString()
    let text = `${t}px`;
    document.getElementById('rightSide').style.width = text;

    window.onresize = function() {
        canvas1.resize();
        let t = window.innerWidth-window.innerHeight.toString()
        let text = `${t}px`;
        document.getElementById('rightSide').style.width = text;
        canvasMinimap.sampleWidth = canvas1.canvas.width/4;
        canvasMinimap.sampleHeight = canvas1.canvas.width/4;
    };
} 
function userDoesNotWantMinimaps() { // if they dont want node info or minimap
    canvas1.canvas.addEventListener("mousedown", function(event) {canvas1.mouseDown(event);});
    canvas1.canvas.addEventListener("mouseup", function() {canvas1.mouseUp()});
    canvas1.canvas.addEventListener("mousemove", function (event) {
        canvas1.mouseMove(event);
    });
    canvas1.canvas.addEventListener('mouseout', function () {canvas1.mouseUp()});

    /// need to call this because when page loads window.onresize is not called; only when window is resized
    let t = window.innerWidth-window.innerHeight.toString()
    let text = `${t}px`;
    document.getElementById('rightSide').style.width = text;

    let t2 = (window.innerHeight/5).toString();
    let text2 = `${t2}px`;
    buttonsContainer.style.gridAutoRows = text2;

    window.onresize = function() {
        canvas1.resize();
        let t = window.innerWidth-window.innerHeight.toString();
        let text = `${t}px`;
        document.getElementById('rightSide').style.width = text;


        let t2 = (window.innerHeight/5).toString();
        let text2 = `${t2}px`;
        buttonsContainer.style.gridAutoRows = text2;

        // delete current minimap and node info and remove event listeners and create new ones and add their listeners
    }
}

///                 BUTTONS                   ///
let a;
let b;
let currentAlgo;
let myInterval;

var runAStar = document.getElementById('AStar');
runAStar.onclick = function() {
    // see if possible
    // this is what allows for the stop/start mechanic
    if ((canvas1.startNode == undefined) || (canvas1.endNode == undefined)) {
        console.log('Start/End Node missing');
        return;
    }
    if (currentAlgo != 'AStar') {
        canvas1.clearAlgo = true; // prevent bugs
        clearInterval(myInterval); // stop repeating the function
    }
    if (!(a)) {
        a = new AStar(canvas1);
    }
    if ((a.finished)||(!a.started)||(canvas1.clearAlgo == true)) {
        // if safe to start then start
        canvas1.clearAlgo = false;
        a = new AStar(canvas1);
        a.initialise();
        myInterval = setInterval(function() {
            a.runAlgorithm();
            if ((a.finished == true)||(a.running == false)) {
                clearInterval(myInterval);
            }
        }, 10);
    }

    else if (a.running == false) {
        a.running = true
        // a = new AStar(canvas1, );
        myInterval = setInterval(function() {
            a.runAlgorithm();
            if ((this.finished == true)||(a.running == false)) {
                clearInterval(myInterval);
            }
        }, 10);
    } 
    else if (a.running == true) {
        // stop if started
        a.running = false;
    }
    currentAlgo = 'AStar'; // to determine prev algo used

}

var runGreedy = document.getElementById('GreedyBestFirst');
runGreedy.onclick = function() {
    // see if possible
    // this is what allows for the stop/start mechanic
    if ((canvas1.startNode == undefined) || (canvas1.endNode == undefined)) {
        console.log('Start/End Node missing');
        return;
    }
    if (currentAlgo != 'Greedy') {
        canvas1.clearAlgo = true; // prevent bugs
        clearInterval(myInterval); // stop repeating the function
    }
    if (!(b)) {
        b = new Greedy(canvas1);
    }
    if ((b.finished)||(!b.started)||(canvas1.clearAlgo == true)) {
        // if safe to start then start
        canvas1.clearAlgo = false;
        b = new Greedy(canvas1);
        b.initialise();
        myInterval = setInterval(function() {
            b.runAlgorithm();
            if ((b.finished == true)||(b.running == false)) {
                clearInterval(myInterval);
            }
        }, 10);
    }

    else if (b.running == false) {
        b.running = true
        // a = new AStar(canvas1, );
        myInterval = setInterval(function() {
            b.runAlgorithm();
            if ((this.finished == true)||(b.running == false)) {
                clearInterval(myInterval);
            }
        }, 10);
    } 
    else if (b.running == true) {
        // stop if started
        b.running = false;
    }
    currentAlgo = 'Greedy'; // to determine prev algo used
}

// adding clear canvas functionailty
var clearCanvas = document.getElementById('ClearCanvas');
clearCanvas.onclick = function() {
    canvas1.clearCanvas();
}

// Mazes

var binaryMaze = document.getElementById('binaryTreeMaze');
binaryMaze.onclick = function() {
    var c = new binaryTreeMaze(canvas1); // instantiate
    c.initialise();
    c.generate();
    c.finish();
    canvas1.clearAlgo = true; // to prevent bugs
};

// decided not to use vertical maze as it was least helpful
// and wouldnt fit on right side as a button
// var vertMaze = document.getElementById('verticalMaze');
// vertMaze.onclick = function() {
//     var d = new verticalMaze(canvas1);
//     d.initialise();
//     d.generate();
//     d.finish();
//     canvas1.clearAlgo = true;
// };

var sidewinder = document.getElementById('sideWinderMaze');
sidewinder.onclick = function() {
    var e = new sideWinderMaze(canvas1);
    e.initialise();
    e.generate();
    e.finish();
    canvas1.clearAlgo = true; // to prevent bugs
};

var clearSolution = document.getElementById('clearSolution');
clearSolution.onclick = function() {
    try {
        clearInterval(myInterval); // to prevent bugs
    } catch {}
    canvas1.clearAlgo = true;
    canvas1.clearSolution();
    canvas1.drawCanvas();
};

var brush = document.getElementById('brush');
brush.onclick = function() {
    canvas1.drawMode = 'brush'; // change draw mode
    document.getElementById('brushCircle').style.opacity = 1; // show users option
    document.getElementById('eraserCircle').style.opacity = 0;

}

var eraser = document.getElementById('eraser');
eraser.onclick = function() {
    canvas1.drawMode = 'eraser'; // change draw mode
    document.getElementById('brushCircle').style.opacity = 0; // show users option
    document.getElementById('eraserCircle').style.opacity = 1;
}

/*                                     */

var slider = document.getElementById('brushSize');
slider.oninput = function() {
    canvas1.brushSize = this.value; // assign brush size to slider value
}

var slider2 = document.getElementById('eraserSize');
slider2.oninput = function() {
    canvas1.eraserSize = this.value; // assign eraser size to slider value
}






//------------------------------------------------------------------

// var socket = io();
