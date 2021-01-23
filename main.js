var ON = false;
var GRID = true;
var MODE_PLAY, MODE_WALLPAPER, MODE_SANDBOX;
var ctx;
var fps = 60;

var mouse = {
    x: 0,
    y: 0
}

var WIN_WIDTH = 1200;
var WIN_HEIGHT = 600;

const VIDEO_FREQUENCY = 1000 / fps;
const GAME_MINUTES = 5;

const MOTOR_BRAKE = 0.97;
const BASE_SPEED = 0.5;
const DIAGONAL_EQ_CONSTANT = 0.585784; // hardcoded for equivalence between the simple motion vs composed motion
const BASE_SPEED_DIAGONAL = Math.sqrt(((DIAGONAL_EQ_CONSTANT * BASE_SPEED)**2)/2);
const MIN_SPEED = 0.1;
const SLOWLY = 8;
const GRAVITY_CONST = 50;

const BULLET_SPEED = 8;
const BULLET_MASS = 0.3; // add this mass to star target
const BULLET_DAMAGE = 5; // reduce this life to starships

const STARS_QUANTITY = 5;
const STARS_BG_QUANTITY = 100;
const STARS_MAX_MASS = 30;
const SUPERNOVA_BULLETS = 60;
const STAR_DAMAGE = 1.5;

var BH_MIN_DISTANCE = 100;
var BH_MAX_DISTANCE = 310;

const GRID_SIZE = 60; // recommended: 30, ideal: 50
const GRID_LIMIT_i = WIN_WIDTH/GRID_SIZE;
const GRID_LIMIT_j = WIN_HEIGHT/GRID_SIZE;

var blackHoleImg = new Image();
blackHoleImg.src = 'media/favicon.png';

var galaxyImg = new Image();
galaxyImg.src = 'media/galaxyBackground.jpg';








/*
██╗░░░██╗░█████╗░██████╗░██╗░█████╗░██████╗░██╗░░░░░███████╗░██████╗
██║░░░██║██╔══██╗██╔══██╗██║██╔══██╗██╔══██╗██║░░░░░██╔════╝██╔════╝
╚██╗░██╔╝███████║██████╔╝██║███████║██████╦╝██║░░░░░█████╗░░╚█████╗░
░╚████╔╝░██╔══██║██╔══██╗██║██╔══██║██╔══██╗██║░░░░░██╔══╝░░░╚═══██╗
░░╚██╔╝░░██║░░██║██║░░██║██║██║░░██║██████╦╝███████╗███████╗██████╔╝
░░░╚═╝░░░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝╚═╝░░╚═╝╚═════╝░╚══════╝╚══════╝╚═════╝*/

var myStarship = new starship(100, 300, 'green',"nsande");
var enemyStarship = new starship(800, 200, 'red',"death star");
var bh = new blackHole(WIN_WIDTH/2, WIN_HEIGHT/2, 80, 80, blackHoleImg);
var stars = [];
var bgStars = [];
var bullets = [];
var gridPoints = [];
var starships = [myStarship];





function readkeys() {
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

    if (keys[82]) {                                     // PRESS R
        rNotPressed && myStarship.respawn();   
        rNotPressed = false;
    } else {
        rNotPressed = true;
    }

    if (keys[71]) {                                     // PRESS G
        spaceNotPressed && (GRID = !GRID);
        spaceNotPressed = false;
    } else {
        spaceNotPressed = true;
    }
}




/*
██╗███╗░░██╗██╗████████╗░░░░██╗███╗░░░███╗░█████╗░██╗███╗░░██╗
██║████╗░██║██║╚══██╔══╝░░░██╔╝████╗░████║██╔══██╗██║████╗░██║
██║██╔██╗██║██║░░░██║░░░░░██╔╝░██╔████╔██║███████║██║██╔██╗██║
██║██║╚████║██║░░░██║░░░░██╔╝░░██║╚██╔╝██║██╔══██║██║██║╚████║
██║██║░╚███║██║░░░██║░░░██╔╝░░░██║░╚═╝░██║██║░░██║██║██║░╚███║
╚═╝╚═╝░░╚══╝╚═╝░░░╚═╝░░░╚═╝░░░░╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝╚═╝░░╚══╝*/

canvas.addEventListener('mousedown', mouseClick, false);
canvas.addEventListener('mouseup', mouseUnclick, false);
canvas.addEventListener('mousemove', mousePosition, false);

function init() {
    stars = [];
    bgStars = [];
    bullets = [];
    gridPoints = [];
    BH_MIN_DISTANCE = 100;
    BH_MAX_DISTANCE = 310;
    bh = new blackHole(WIN_WIDTH/2, WIN_HEIGHT/2, 80, 80, blackHoleImg);
    generateStars(STARS_QUANTITY);
    generateBackgroundStars(STARS_BG_QUANTITY);
    initDynGrid();
    ON = true;
}

function initWallpaperMode() {
    stars = [];
    bgStars = [];
    bullets = [];
    gridPoints = [];
    BH_MIN_DISTANCE = 100;
    BH_MAX_DISTANCE = 400;
    bh = new blackHole(WIN_WIDTH/2, WIN_HEIGHT/2, 80, 80, blackHoleImg);
    generateStars(STARS_QUANTITY);
    generateBackgroundStars(STARS_BG_QUANTITY);
    ON = true;
}
    

function main() {
    clearCanvas();
    ctx.drawImage(galaxyImg, 0, 0, WIN_WIDTH, WIN_HEIGHT);
    GRID && drawDynGrid();

    readkeys();


    // Starships
    if (!MODE_WALLPAPER) {
        if (myStarship.life > 0) {
            myStarship.moveRefresh();
            if (myStarship.okToDraw()) {
            /* SERVER */ myStarship.draw(); 
            /* CLIENT */ myStarship.msTime -= .25 - timeDilationNearStar(myStarship);
            } 
        } else {
            myStarship.x = myStarship.y = -100;
        }
        //enemyStarship.draw();
    }
        
    
    // Background Stars
    for (let i=0; i<bgStars.length; i++) bgStars[i].draw();

    // Principal Stars
    for (let i=0; i<stars.length; i++) { 
        let s = stars[i];
        if (s.mass > STARS_MAX_MASS) {
            starExplode(s);
        }
        
        s.blurDraw();
    }
    
    // Black Hole
    bh.draw();

    // Bullets & collisions
    for (let i=0; i<bullets.length; i++) {
        if (bullets[i].outWindow || insideStar(bullets[i]) || insideStarship(bullets[i])) {
            bullets.splice(i, 1);
            i--;
        } else {
            bullets[i].draw();
        }
    }

    insideStar(myStarship, false);

    // HUD
    if (!MODE_WALLPAPER) {
        drawTimeLeft(myStarship);
        drawLifeBar(myStarship);
    }

    // Updates
    
}

ON && setInterval(main, VIDEO_FREQUENCY);