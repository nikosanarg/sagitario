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









/*
██╗███╗░░██╗██╗████████╗░░░░██╗███╗░░░███╗░█████╗░██╗███╗░░██╗
██║████╗░██║██║╚══██╔══╝░░░██╔╝████╗░████║██╔══██╗██║████╗░██║
██║██╔██╗██║██║░░░██║░░░░░██╔╝░██╔████╔██║███████║██║██╔██╗██║
██║██║╚████║██║░░░██║░░░░██╔╝░░██║╚██╔╝██║██╔══██║██║██║╚████║
██║██║░╚███║██║░░░██║░░░██╔╝░░░██║░╚═╝░██║██║░░██║██║██║░╚███║
╚═╝╚═╝░░╚══╝╚═╝░░░╚═╝░░░╚═╝░░░░╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝╚═╝░░╚══╝*/



function init() {
    stars = [];
    bgStars = [];
    bullets = [];
    gridPoints = [];
    MODE_PLAY = true;
    MODE_WALLPAPER = false;
    MODE_SANDBOX = false;

    canvas.style.display = 'block';
    indexWin.style.display = 'none';
    gbb.style.display = 'block';
    WIN_WIDTH = 1200;
    WIN_HEIGHT = 600;
    canvas.width = WIN_WIDTH;
    canvas.height = WIN_HEIGHT;
    canvasWindow.style.padding = "'" + (Math.round(getHeight() - WIN_HEIGHT)) + "px'";

    BH_MIN_DISTANCE = 100;
    BH_MAX_DISTANCE = 310;
    bh = new blackHole(WIN_WIDTH/2, WIN_HEIGHT/2, 80, 80, blackHoleImg);
    generateStars(STARS_QUANTITY);
    generateBackgroundStars(STARS_BG_QUANTITY);
    initDynGrid();

    ON = true;
    GRID = true;
    ON && setInterval(main, VIDEO_FREQUENCY);
}





function initWallpaperMode() {
    document.documentElement.requestFullscreen();

    stars = [];
    bgStars = [];
    bullets = [];
    gridPoints = [];
    MODE_PLAY = false;
    MODE_WALLPAPER = true;
    MODE_SANDBOX = false;

    canvas.style.display = 'block';
    indexWin.style.display = 'none';
    gbb.style.display = 'block';
    WIN_WIDTH = window.screen.width;
    WIN_HEIGHT = window.screen.height;
    canvas.width = WIN_WIDTH;
    canvas.height = WIN_HEIGHT;
    canvasWindow.style.padding = '0px';

    BH_MIN_DISTANCE = 100;
    BH_MAX_DISTANCE = 400;
    bh = new blackHole(WIN_WIDTH/2, WIN_HEIGHT/2, 80, 80, blackHoleImg);
    generateStars(STARS_QUANTITY * 2);
    generateBackgroundStars(STARS_BG_QUANTITY * 3);

    ON = true;
    GRID = false;
    ON && setInterval(main, VIDEO_FREQUENCY);
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
    
}