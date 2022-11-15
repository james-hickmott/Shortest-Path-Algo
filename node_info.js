import { getHeuristic } from "./UtilityFunctions.js";

export class nodeInfo {
    constructor(ACanvas, size) {
        this.canvas = document.createElement('CANVAS');
        this.ctx = (this.canvas).getContext('2d');
        this.copiedCanvas = ACanvas;
        this.canvas.width = size;
        this.canvas.height = size;
        this.nodeSize = ((this.canvas).width)/3;
        this.canvas.id = 'nodeMap';
  
        // add a canvas to the document
        document.getElementById('infoContainer').appendChild(this.canvas);
    }

    getNodeList(event) {
        let cRect = this.copiedCanvas.canvas.getBoundingClientRect();// Gets CSS pos, and width/height
        // get the current node we are hovering cursor over
        let hoverNode = this.copiedCanvas.grid[(Math.floor((event.clientX - cRect.left)/(this.copiedCanvas.canvas.width/this.copiedCanvas.cols)))]
        [(Math.floor((event.clientY - cRect.top)/(this.copiedCanvas.canvas.height/this.copiedCanvas.rows)))];
        let temp = [];
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                // exception handling used because if
                // we are trying to add nodes that are off
                // the edge of the grid then it wont work
                try {
                    temp.push(this.copiedCanvas.grid[hoverNode.ordinates[0]+i][hoverNode.ordinates[1]+j])
                } catch {
                    temp.push('null')
                }
            }
        }
        this.drawNodes(temp);
    }

    drawNodes(nodeList) {
        this.ctx.font = "15px Montserrat";
        // font of numbers used in canvas
        let nodeNumber = 0; // index in list
        for (let i = 0; i != 3; i++) {
            for (let j = 0; j != 3; j++) {
                this.ctx.beginPath();
                this.ctx.rect(i*this.nodeSize, j*this.nodeSize, this.nodeSize, this.nodeSize);
                if (nodeList[nodeNumber] != 'null') {
                    this.ctx.fillStyle = nodeList[nodeNumber].colour;
                    this.ctx.fill();
                }
                else if (nodeList[nodeNumber] == 'null') {
                    this.ctx.fillStyle = this.copiedCanvas.clearColour;
                    this.ctx.fill();
                }
                this.ctx.lineWidth = 0.1;
                this.ctx.strokeStyle = 'black'; // outline colour
                this.ctx.stroke(); // outline
                this.ctx.fillStyle = 'white'; // node colour
                if (this.copiedCanvas.startNode && this.copiedCanvas.endNode && (nodeList[nodeNumber] != 'null') && nodeList[nodeNumber].isWall == false) {
                    // get heuristic numbers and paste them onto the canvas with
                    // their respective nodes
                    let num = getHeuristic(nodeList[nodeNumber], this.copiedCanvas.endNode);
                    num = Math.round(num * 10) / 10 // round to 1 dp
                    this.ctx.fillText(num.toString(), (i*this.nodeSize)+1, (j*this.nodeSize)+13);
                    num = getHeuristic(this.copiedCanvas.startNode, nodeList[nodeNumber]);
                    num = Math.round(num * 10) / 10 // round to 1 dp
                    this.ctx.fillText(num.toString(), (i*this.nodeSize)+1, (j*this.nodeSize)+101);
                }
                nodeNumber++;
            }
        }
    }
}