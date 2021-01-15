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
const MIN_SPEED = 0.3;
const SLOWLY = 8;
const BULLET_SPEED = 8;
const BULLET_MASS = 0.3;
const STARS_QUANTITY = 5;
const STARS_MAX_MASS = 30;
const SUPERNOVA_BULLETS = 60;
const GRAVITY_CONST = 50;
const BH_MIN_DISTANCE = 120;
const BH_MAX_DISTANCE = 320;

var blackHoleImg = new Image();
blackHoleImg.src = 'favicon.png';

var galaxyImg = new Image();
galaxyImg.src = 'galaxyBackground.jpg';





/*
██╗░░██╗██████╗░░█████╗░░█████╗░██████╗░██████╗░░░░░██╗███╗░░░███╗░█████╗░██╗░░░██╗░██████╗███████╗
██║░██╔╝██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔══██╗░░░██╔╝████╗░████║██╔══██╗██║░░░██║██╔════╝██╔════╝
█████═╝░██████╦╝██║░░██║███████║██████╔╝██║░░██║░░██╔╝░██╔████╔██║██║░░██║██║░░░██║╚█████╗░█████╗░░
██╔═██╗░██╔══██╗██║░░██║██╔══██║██╔══██╗██║░░██║░██╔╝░░██║╚██╔╝██║██║░░██║██║░░░██║░╚═══██╗██╔══╝░░
██║░╚██╗██████╦╝╚█████╔╝██║░░██║██║░░██║██████╔╝██╔╝░░░██║░╚═╝░██║╚█████╔╝╚██████╔╝██████╔╝███████╗
╚═╝░░╚═╝╚═════╝░░╚════╝░╚═╝░░╚═╝╚═╝░░╚═╝╚═════╝░╚═╝░░░░╚═╝░░░░░╚═╝░╚════╝░░╚═════╝░╚═════╝░╚══════╝*/

// KEYBOARD HANDLER
window.addEventListener("keydown", keysPressed, false);
window.addEventListener("keyup", keysReleased, false);
var keys = [];

function keysPressed(e) {
	keys[e.keyCode] = true;
}

function keysReleased(e) {
	keys[e.keyCode] = false;
}

// MOUSE HANDLER
function mouseClick(e) {
    myStarship.shooting = true;
    var bulletObject = new bullet(myStarship.x, myStarship.y, mouse.x, mouse.y);
    bullets.push(bulletObject);
}

function mouseUnclick(e) {
    myStarship.shooting = false;
}

function mousePosition(e) {
    let rect = canvas.getBoundingClientRect();
    mouse.x = e.pageX - rect.left;
    mouse.y = e.pageY - rect.top;
}








/*
██████╗░░█████╗░░██████╗███████╗  ███████╗██╗░░░██╗███╗░░██╗░█████╗░████████╗░██████╗
██╔══██╗██╔══██╗██╔════╝██╔════╝  ██╔════╝██║░░░██║████╗░██║██╔══██╗╚══██╔══╝██╔════╝
██████╦╝███████║╚█████╗░█████╗░░  █████╗░░██║░░░██║██╔██╗██║██║░░╚═╝░░░██║░░░╚█████╗░
██╔══██╗██╔══██║░╚═══██╗██╔══╝░░  ██╔══╝░░██║░░░██║██║╚████║██║░░██╗░░░██║░░░░╚═══██╗
██████╦╝██║░░██║██████╔╝███████╗  ██║░░░░░╚██████╔╝██║░╚███║╚█████╔╝░░░██║░░░██████╔╝
╚═════╝░╚═╝░░╚═╝╚═════╝░╚══════╝  ╚═╝░░░░░░╚═════╝░╚═╝░░╚══╝░╚════╝░░░░╚═╝░░░╚═════╝*/

function clearCanvas() {
    try {
        canvas.width = WIN_WIDTH;
        canvas.height = WIN_HEIGHT;
    } catch {
        return false;
    }
}

function randomNumber(limit) {
    return Math.floor(Math.random() * limit);
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
}

function getAngle(x1, y1, x2, y2) {
    let angle = Math.atan2(y2-y1, x1-x2);
    if (y1>y2) {
        angle += 2*Math.PI;
    }
    return angle;
}

function addStarsGravity(e) {
    let addSpeedX = 0;
    let addSpeedY = 0;
    let s, gForce;
    // Calculate gravity for each star
    for (let i=0; i<stars.length; i++) {
        s = stars[i];
        gForce = GRAVITY_CONST * s.mass / (distance(e.x, e.y, s.x, s.y)**2);
        addSpeedX -= gForce * ((e.x-s.x)/(Math.abs(e.x-s.x)+Math.abs(e.y-s.y)));
        addSpeedY -= gForce * ((e.y-s.y)/(Math.abs(e.x-s.x)+Math.abs(e.y-s.y)));
    }
    // Same for the Black Hole
    gForce = GRAVITY_CONST * bh.mass / (distance(e.x, e.y, bh.x, bh.y)**2);
    addSpeedX -= gForce * ((e.x-bh.x)/(Math.abs(e.x-bh.x)+Math.abs(e.y-bh.y)));
    addSpeedY -= gForce * ((e.y-bh.y)/(Math.abs(e.x-bh.x)+Math.abs(e.y-bh.y)));

    // Resultant speed
    e.speedX += addSpeedX;
    e.speedY += addSpeedY;
}

function insideStar(e) {
    for (let i=0; i<stars.length; i++) {
        let s = stars[i];
        if (distance(e.x, e.y, s.x, s.y) <= s.mass) {
            s.mass += BULLET_MASS;
            return true;
        }   
        if (distance(e.x, e.y, bh.x, bh.y) <= bh.mass) {
            return true;
        } 
    }
    return false;
}

function starExplode(e) {
    e.mass = 8;
    for (let i=0; i<SUPERNOVA_BULLETS; i++) {
        let despX = Math.sin((i/(SUPERNOVA_BULLETS/2))*180/Math.PI);
        let despY = Math.cos((i/(SUPERNOVA_BULLETS/2))*180/Math.PI);
        var bulletObject = new bullet(e.x+25*despX, e.y+25*despY, e.x + 40*despX, e.y + 40*despY);
        bullets.push(bulletObject);
    }
    let searchNewDistance = true;
    let newx, newy, dist;
    while (searchNewDistance) {
        newx = randomNumber(WIN_WIDTH);
        newy = randomNumber(WIN_HEIGHT);
        dist = distance(newx, newy, bh.x, bh.y);
        if (dist > BH_MIN_DISTANCE && dist < BH_MAX_DISTANCE) {
            e.x = newx;
            e.y = newy;
            searchNewDistance = false;
        }
    } 
}

function generateStars(cant = 10) {
    for (let i=0; i<cant; i++) {
        let searchNewDistance = true;
        let mass, newx, newy, dist, ang, newStar;
        while (searchNewDistance) {
            mass = randomNumber(16)+10;
            newx = randomNumber(WIN_WIDTH);
            newy = randomNumber(WIN_HEIGHT);
            dist = distance(newx, newy, bh.x, bh.y);
            ang = getAngle(newx, newy, bh.x, bh.y);
            if (dist > BH_MIN_DISTANCE && dist < BH_MAX_DISTANCE) {
                newStar = new star(newx, newy, mass, dist, ang);
                stars.push(newStar);
                searchNewDistance = false;
            }
        } 
    }
}

function generateBackgroundStars(cant = 100) {
    for (let i=0; i<cant; i++) {
        let newStar = new star(randomNumber(WIN_WIDTH), randomNumber(WIN_HEIGHT), 1, '#666');
        bgStars.push(newStar);
    }
}







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
    generateBackgroundStars(100);
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

    for (let i=0; i<bgStars.length; i++) { bgStars[i].draw() }

    for (let i=0; i<stars.length; i++) { 
        if (stars[i].mass > STARS_MAX_MASS) {
            starExplode(stars[i]);
        }
        stars[i].blurDraw();
    }
    
    myStarship.draw();
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
    /*
    console.log("Black Hole: " + bh.x + " - " + bh.y);
    console.log("Star: " + stars[0].x + " - " + stars[0].y);
    console.log(angle(stars[0].x, stars[0].y, bh.x, bh.y));
    console.log(distance(stars[0].x, stars[0].y, bh.x, bh.y));
    */
}

ON && setInterval(main, 1000/fps);