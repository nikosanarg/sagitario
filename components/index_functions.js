canvas = document.getElementById('canvas');
indexWin = document.getElementById('indexWindow');
ctx = canvas.getContext('2d');
gbb = document.getElementById('go-back-button');


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

function clickGoBack() {
    clearTimeout(play);
    if (document.fullscreenElement) document.exitFullscreen();
    MODE_PLAY = false;
    MODE_WALLPAPER = false;
    MODE_SANDBOX = false;
    canvas.style.display = 'none';
    indexWin.style.display = 'block';
    gbb.style.display = 'none';
    ON = false;
    GRID = false;
}