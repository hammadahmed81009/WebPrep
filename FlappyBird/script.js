var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var bird = new Image();
bird.src = "bird.png";

var pipeNorth = new Image();
pipeNorth.src = "pipeNorth.png";

var pipeSouth = new Image();
pipeSouth.src = "pipeSouth.png";

var gap = 85;
var constant;

var bX = 10;
var bY = 150;
var gravity = 1.5;

var score = 0;

document.addEventListener("keydown", moveUp);

function moveUp() {
    bY -= 25;
}

var pipe = [];
pipe[0] = {
    x: canvas.width,
    y: 0
};

function draw() {
    context.drawImage(bird, bX, bY);

    for (var i = 0; i < pipe.length; i++) {
        constant = pipeNorth.height + gap;
        context.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
        context.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant);

        pipe[i].x--;

        if (pipe[i].x === 125) {
            pipe.push({
                x: canvas.width,
                y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
            });
        }

        if (
            (bX + bird.width >= pipe[i].x &&
                bX <= pipe[i].x + pipeNorth.width &&
                (bY <= pipe[i].y + pipeNorth.height ||
                    bY + bird.height >= pipe[i].y + constant)) ||
            bY + bird.height >= canvas.height
        ) {
            location.reload(); // reload the page
        }

        if (pipe[i].x === 5) {
            score++;
        }
    }

    context.fillStyle = "#000";
    context.font = "20px Verdana";
    context.fillText("Score : " + score, 10, canvas.height - 20);

    bY += gravity;
    requestAnimationFrame(draw);
}

pipeNorth.onload = draw;
