export class Minimap {
    constructor(ACanvas, canvasWidth, canvasHeight, sampleWidth, sampleHeight) {
        this.canvas = document.createElement('CANVAS');
        this.ctx = (this.canvas).getContext('2d');
        this.copiedCanvas = ACanvas;
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.sampleWidth = sampleWidth;
        this.sampleHeight = sampleHeight;
        this.canvas.id = 'Minimap';

        // add a canvas to the document
        document.getElementById('infoContainer').appendChild(this.canvas);
    }

    getData(event) {
        let cRect = this.copiedCanvas.canvas.getBoundingClientRect();
        let MouseX = event.clientX - cRect.left;
        let MouseY = event.clientY - cRect.top;
        // based on the position of the mouse draw a square around it and paste this image into another canvas
        this.ctx.drawImage((this.copiedCanvas.canvas),
         MouseX-(this.sampleWidth/2),
         MouseY-(this.sampleHeight/2),
         this.sampleWidth,
         this.sampleHeight,
         0, 0,
         this.canvas.width,
         this.canvas.height)
    }
}

