const ON = true;
var canvas;
var ctx;
var fps = 60;

var mouse = {
    x: 0,
    y: 0
}

const WIN_WIDTH = 1200;
const WIN_HEIGHT = 600;
const MOTOR_BRAKE = 0.97;
const BASE_SPEED = 0.5;
const DIAGONAL_EQ_CONSTANT = 0.585784; // hardcoded for equivalence between the simple motion vs composed motion
const BASE_SPEED_DIAGONAL = Math.sqrt(((DIAGONAL_EQ_CONSTANT * BASE_SPEED)**2)/2);
const MIN_SPEED = 0.1;
const SLOWLY = 8;
const BULLET_SPEED = 8;
const BULLET_MASS = 0.3;
const STARS_QUANTITY = 5;
const STARS_MAX_MASS = 30;
const SUPERNOVA_BULLETS = 60;
const GRAVITY_CONST = 50;
const STARS_BG_QUANTITY = 100;
const BH_MIN_DISTANCE = 120;
const BH_MAX_DISTANCE = 320;

var blackHoleImg = new Image();
blackHoleImg.src = 'favicon.png';

var galaxyImg = new Image();
galaxyImg.src = 'galaxyBackground.jpg';








/*
██╗░░░██╗░█████╗░██████╗░██╗░█████╗░██████╗░██╗░░░░░███████╗░██████╗
██║░░░██║██╔══██╗██╔══██╗██║██╔══██╗██╔══██╗██║░░░░░██╔════╝██╔════╝
╚██╗░██╔╝███████║██████╔╝██║███████║██████╦╝██║░░░░░█████╗░░╚█████╗░
░╚████╔╝░██╔══██║██╔══██╗██║██╔══██║██╔══██╗██║░░░░░██╔══╝░░░╚═══██╗
░░╚██╔╝░░██║░░██║██║░░██║██║██║░░██║██████╦╝███████╗███████╗██████╔╝
░░░╚═╝░░░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝╚═╝░░╚═╝╚═════╝░╚══════╝╚══════╝╚═════╝*/

var myStarship = new starship(100, 300, 'green',"nsande");
var enemyStarship = new starship(800, 200, 'red',"death star");
var bullets = [];
var stars = [];
var bgStars = [];
var bh = new blackHole(WIN_WIDTH/2, WIN_HEIGHT/2, 100, 100, blackHoleImg);









/*
██╗███╗░░██╗██╗████████╗░░░░██╗███╗░░░███╗░█████╗░██╗███╗░░██╗
██║████╗░██║██║╚══██╔══╝░░░██╔╝████╗░████║██╔══██╗██║████╗░██║
██║██╔██╗██║██║░░░██║░░░░░██╔╝░██╔████╔██║███████║██║██╔██╗██║
██║██║╚████║██║░░░██║░░░░██╔╝░░██║╚██╔╝██║██╔══██║██║██║╚████║
██║██║░╚███║██║░░░██║░░░██╔╝░░░██║░╚═╝░██║██║░░██║██║██║░╚███║
╚═╝╚═╝░░╚══╝╚═╝░░░╚═╝░░░╚═╝░░░░╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝╚═╝░░╚══╝*/

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.addEventListener('mousedown', mouseClick, false);
    canvas.addEventListener('mouseup', mouseUnclick, false);
    canvas.addEventListener('mousemove', mousePosition, false);
    generateStars(STARS_QUANTITY);
    generateBackgroundStars(STARS_BG_QUANTITY);
}

    

function main() {
    clearCanvas();
    ctx.drawImage(galaxyImg, 0, 0);

    if (keys[87] && keys[65]) {                 // PRESS W + A  -> Up Left
        myStarship.addSpeed(-1, -1);
    } else {
        (keys[87]) && myStarship.addSpeed(0, -1);       // PRESS JUST W     -> Up
        (keys[65]) && myStarship.addSpeed(-1, 0);       // PRESS JUST A     -> Left
    }

    if (keys[87] && keys[68]) {                 // PRESS W + D  -> Up Right
        myStarship.addSpeed(1, -1);
    } else {
        (keys[87]) && myStarship.addSpeed(0, -1);       // PRESS JUST W     -> Up
        (keys[68]) && myStarship.addSpeed(1, 0);        // PRESS JUST D     -> Right
    }

    if (keys[83] && keys[65]) {                 // PRESS S + A  -> Down Left
        myStarship.addSpeed(-1, 1);
    } else {
        (keys[83]) && myStarship.addSpeed(0, 1);        // PRESS JUST S     -> Down
        (keys[65]) && myStarship.addSpeed(-1, 0);       // PRESS JUST A     -> Left
    }

    if (keys[83] && keys[68]) {                 // PRESS S + D  -> Down Right
        myStarship.addSpeed(1, 1);
    } else {
        (keys[83]) && myStarship.addSpeed(0, 1);        // PRESS JUST S     -> Down
        (keys[68]) && myStarship.addSpeed(1, 0);        // PRESS JUST D     -> Right
    }

    if (keys[32]) {                                     // PRESS SPACEBAR
        if (spaceNotPressed) {
            myStarship.respawn();
        }        
        spaceNotPressed = false;
    } else {
        spaceNotPressed = true;
    }

    for (let i=0; i<bgStars.length; i++) { bgStars[i].draw() }

    for (let i=0; i<stars.length; i++) { 
        if (stars[i].mass > STARS_MAX_MASS) {
            starExplode(stars[i]);
        }
        stars[i].blurDraw();
    }
    
    myStarship.moveRefresh();
    myStarship.okToDraw() && myStarship.draw();
    
    //enemyStarship.draw();

    for (let i=0; i<bullets.length; i++) {
        if (bullets[i].outWindow || insideStar(bullets[i])) {
            bullets.splice(i, 1);
            i--;
        } else {
            bullets[i].draw();
        }
    }

    bh.draw();
}

ON && setInterval(main, 1000/fps);