/*
██╗░░░██╗░█████╗░██████╗░██╗░█████╗░██████╗░██╗░░░░░███████╗░██████╗
██║░░░██║██╔══██╗██╔══██╗██║██╔══██╗██╔══██╗██║░░░░░██╔════╝██╔════╝
╚██╗░██╔╝███████║██████╔╝██║███████║██████╦╝██║░░░░░█████╗░░╚█████╗░
░╚████╔╝░██╔══██║██╔══██╗██║██╔══██║██╔══██╗██║░░░░░██╔══╝░░░╚═══██╗
░░╚██╔╝░░██║░░██║██║░░██║██║██║░░██║██████╦╝███████╗███████╗██████╔╝
░░░╚═╝░░░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝╚═╝░░╚═╝╚═════╝░╚══════╝╚══════╝╚═════╝*/


var blackHoleImg = new Image();
blackHoleImg.src = 'media/favicon.png';

var galaxyImg = new Image();
galaxyImg.src = 'media/galaxyBackground.jpg';

var myStarship = new starship(100, 300, 'green',"nsande");
var enemyStarship = new starship(800, 200, 'red',"death star");
var bh = new blackHole(WIN_WIDTH/2, WIN_HEIGHT/2, 80, 80, blackHoleImg);
var stars = [];
var bgStars = [];
var bullets = [];
var gridPoints = [];
var starships = [myStarship];

var play;
var damageModal = false;








/*
██╗███╗░░██╗██╗████████╗░░░░██╗███╗░░░███╗░█████╗░██╗███╗░░██╗
██║████╗░██║██║╚══██╔══╝░░░██╔╝████╗░████║██╔══██╗██║████╗░██║
██║██╔██╗██║██║░░░██║░░░░░██╔╝░██╔████╔██║███████║██║██╔██╗██║
██║██║╚████║██║░░░██║░░░░██╔╝░░██║╚██╔╝██║██╔══██║██║██║╚████║
██║██║░╚███║██║░░░██║░░░██╔╝░░░██║░╚═╝░██║██║░░██║██║██║░╚███║
╚═╝╚═╝░░╚══╝╚═╝░░░╚═╝░░░╚═╝░░░░╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝╚═╝░░╚══╝*/

function commonInit() {
    stars = [];
    bgStars = [];
    bullets = [];
    gridPoints = [];
    bh = new blackHole(WIN_WIDTH/2, WIN_HEIGHT/2, 80, 80, blackHoleImg);

    canvas.style.display = 'block';
    indexWin.style.display = 'none';
    gbb.style.display = 'block';
    canvas.width = WIN_WIDTH;
    canvas.height = WIN_HEIGHT;

    damageModal = false;
    play = setInterval(main, VIDEO_FREQUENCY);
}





function init() {
    MODE_PLAY = true;
    MODE_WALLPAPER = false;
    MODE_SANDBOX = false;
    GRID = true;
    BH_MIN_DISTANCE = 100;
    BH_MAX_DISTANCE = 310;
    WIN_WIDTH = 1200;
    WIN_HEIGHT = 600;
    canvasWindow.style.padding = "'" + (Math.round(getHeight() - WIN_HEIGHT)) + "px'";

    ON = true;
    commonInit();
    generateStars(STARS_QUANTITY);
    generateBackgroundStars(STARS_BG_QUANTITY);
    initDynGrid();
}





function initWallpaperMode() {
    document.documentElement.requestFullscreen();
    MODE_PLAY = false;
    MODE_WALLPAPER = true;
    MODE_SANDBOX = false;
    GRID = false;
    BH_MIN_DISTANCE = 100;
    BH_MAX_DISTANCE = 400;
    WIN_WIDTH = window.screen.width;
    WIN_HEIGHT = window.screen.height;
    canvasWindow.style.padding = '0px';

    ON = true;
    commonInit();
    generateStars(STARS_QUANTITY * 2);
    generateBackgroundStars(STARS_BG_QUANTITY * 3);
}
    




function main() {
    clearCanvas();
    ctx.drawImage(galaxyImg, 0, 0, WIN_WIDTH, WIN_HEIGHT);
    GRID && drawDynGrid();

    damageModal = false;

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
            if (myStarship.explosion == false) {
                myStarship.explosion = true;
                SOUND && s_explosion.play();
                // INSERT HERE EXPLOSION GIF
            }
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
    seeDamageWindow();

    // HUD
    if (!MODE_WALLPAPER) {
        drawTimeLeft(myStarship);
        drawLifeBar(myStarship);
    }
    
}