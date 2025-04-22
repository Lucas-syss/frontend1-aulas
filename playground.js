function drawStaticShapes(ctx) {
    const rectangle = new Path2D();
    rectangle.rect(10, 10, 50, 50);

    const circle = new Path2D();
    circle.arc(100, 35, 25, 0, 2 * Math.PI);

    ctx.stroke(rectangle);
    ctx.fill(circle);
}

function animateLine() {
    const canvas = document.getElementById("canvas");
    if (!canvas.getContext) return;
    
    const ctx = canvas.getContext("2d");
    let lineEndX = 20; 
    const endTargetX = 400; 

    function drawFrame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); 

        drawStaticShapes(ctx);
        
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "green";
        ctx.moveTo(20, 140);
        ctx.lineTo(lineEndX, 140);
        ctx.stroke();

    
        if (lineEndX < endTargetX) {
            lineEndX += 7; 
            requestAnimationFrame(drawFrame);
        } else {
            const progress = document.getElementById("progress");
            progress.style.display = "block";
        }
        
    }

    drawFrame();
}

animateLine();
