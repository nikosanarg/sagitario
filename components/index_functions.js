canvas = document.getElementById('canvas');
indexWin = document.getElementById('indexWindow');
ctx = canvas.getContext('2d');
gbb = document.getElementById('go-back-button');

function resize(){    
    $("#canvas").outerHeight($(window).height()-$("#canvas").offset().top- Math.abs($("#canvas").outerHeight(true) - $("#canvas").outerHeight()));
}
  
$(document).ready(function(){
    resize();
    $(window).on("resize", function(){                      
        resize();
    });
});

function getWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}
  
function getHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    );
}

function clickPlay() {
    MODE_PLAY = true;
    MODE_WALLPAPER = false;
    MODE_SANDBOX = false;
    canvas.style.display = 'block';
    canvasWindow.style.padding = '1%';
    indexWin.style.display = 'none';
    gbb.style.display = 'block';
    WIN_WIDTH = 1200;
    WIN_HEIGHT = 600;
    canvas.width = WIN_WIDTH;
    canvas.height = WIN_HEIGHT;
    ON = true;
    GRID = true;
    init();
    main();
    ON && setInterval(main, VIDEO_FREQUENCY);
}

function clickWallpaperMode() {
    document.documentElement.requestFullscreen();
    MODE_PLAY = false;
    MODE_WALLPAPER = true;
    MODE_SANDBOX = false;
    canvas.style.display = 'block';
    canvasWindow.style.padding = '0%';
    indexWin.style.display = 'none';
    gbb.style.display = 'block';
    WIN_WIDTH = 1366;
    WIN_HEIGHT = 768;
    canvas.width = WIN_WIDTH;
    canvas.height = WIN_HEIGHT;
    ON = true;
    GRID = false;
    initWallpaperMode();
    main();
    ON && setInterval(main, VIDEO_FREQUENCY);
}

function clickGoBack() {
    try { document.exitFullscreen() }
    catch { console.log('q onda') }
    MODE_PLAY = false;
    MODE_WALLPAPER = false;
    MODE_SANDBOX = false;
    canvas.style.display = 'none';
    indexWin.style.display = 'block';
    gbb.style.display = 'none';
    ON = false;
    GRID = false;
}