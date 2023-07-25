var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

var anstPosition

var mouseX = 0;
var mouseY = 0;

var spawnPositionsYLeft = [];
var ants = [];
var deadAnts = [];
var timeToSpawn = 500;

var spawns = parseInt((canvasHeight - 101) / 50);

window.addEventListener("mousemove", function(event){
    mouseX = event.clientX - canvas.offsetLeft;
    mouseY = event.clientY - canvas.offsetTop;
});

function generateSpawns() {
    for(var i = 0; i <= spawns; i++) {
        if(i == 0) {
            spawnPositionsYLeft[i] = 50;
        } else {
            spawnPositionsYLeft[i] = spawnPositionsYLeft[i-1] + 50;
        }
    }
}

const Ant = function(src) {
    this.antWidth = 60;
    this.antHeight = 52;
    this.antSpeed = 5,
    this.spawnPosition = Math.floor(Math.random()*spawnPositionsYLeft.length);
    this.antPositionX = -60,
    this.antPositionY = spawnPositionsYLeft[this.spawnPosition],

    this.image = new Image();
    this.image.src = src;
    this.spriteX = 0;
    this.spriteY = 0;
    
    this.kill = false;

    const intervalAnimation = setInterval(() => {
        if(this.spriteX >= 180) {
            this.spriteX = 0;
        } else {
            this.spriteX += 60;
        }
    }, 150);

    this.drawAnt = function() {
        if(!this.kill) {
            ctx.drawImage(
                this.image,
                this.spriteX,
                this.spriteY,
                this.antWidth,
                this.antHeight,
                this.antPositionX,
                this.antPositionY,
                this.antWidth,
                this.antHeight
            )
        } else {
            ctx.drawImage(
                this.image,
                240,
                0,
                this.antWidth,
                this.antHeight,
                this.antPositionX,
                this.antPositionY,
                this.antWidth,
                this.antHeight
            )
        }
    },

    this.antRun = function() {
        if(!this.kill) {
            this.antPositionX += this.antSpeed;
        }
    },

    this.cancelInterval = function() {
        clearInterval(intervalAnimation);
    }

    this.antKill = function() {
        this.cancelInterval();
        this.kill = true;
    }
}

const Map = function(src) {
    this.image = new Image()
    this.image.src = src;

    this.drawMap = function() {
        ctx.drawImage(
            this.image,
            0,
            0,
            1000,
            600,
            0,
            0,
            1000,
            600
        )
    }
}

const mapBackground = new Map("./img/fundo_madeira.jpg");

function generateAnt() {
    setInterval(function(){
        ants.push(new Ant("./img/formiga_sprite.png"));
        console.log(ants)
    },timeToSpawn);
}

function drawAnts() {
    for(var i = 0; i < ants.length; i++) {
        ants[i].drawAnt();
    }
}

function drawDeadAnts() {
    for(var i = 0; i < deadAnts.length; i++) {
        deadAnts[i].drawAnt();
    }
}

function antsRun() {
    for(var i = 0; i < ants.length; i++) {
        ants[i].antRun();
    }
}

function clearAnt(position) {
    if(ants.length >= 1) {
        ants.splice(position, 1);
    }
}

function antScape(position) {
    if(ants.length >= 1) {
        if(ants[position].antPositionX > canvas.width) {
            clearAnt(position);
        }
    }
}

function clearDeadAnt() {
    setTimeout(function() {
        deadAnts.shift();
    }, 1000);
}


window.addEventListener("mousedown", function(event) {
    if(event.buttons == 1) {
        for(var i = 0; i < ants.length; i++) {
            var positionX = ants[i].antPositionX;
            var positionY = ants[i].antPositionY;
            var width = ants[0].antWidth;
            var height = ants[0].antHeight;
            if(mouseX >= positionX && mouseX <= positionX+width && mouseY >= positionY && mouseY <= positionY+height) {
                ants[i].antKill();
                deadAnts.push(ants[i]);
                ants.splice(i, 1);
                clearDeadAnt();
            }
        }
    }
});

function loop() {
    window.requestAnimationFrame(loop,canvas);
    game();
    render();
}

function render() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    mapBackground.drawMap();
    drawAnts();
    drawDeadAnts()
}

function game() {
    antScape(0);
    antsRun();
    
}

function start() {
    generateSpawns();
    loop();
    generateAnt();
}

start();