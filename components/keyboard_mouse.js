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
    if (!MODE_WALLPAPER) {
        myStarship.shooting = true;
        let shotModule = distance(myStarship.x, myStarship.y, mouse.x, mouse.y);
        let distanceRatio = 13 / shotModule;
        let dx = (mouse.x - myStarship.x) * distanceRatio;
        let dy = (mouse.y - myStarship.y) * distanceRatio;
        var bulletObject = new bullet(myStarship.x + dx, myStarship.y + dy, mouse.x, mouse.y);
        bullets.push(bulletObject);
    }
}

function mouseUnclick(e) {
    myStarship.shooting = false;
}

function mousePosition(e) {
    let rect = canvas.getBoundingClientRect();
    mouse.x = e.pageX - rect.left;
    mouse.y = e.pageY - rect.top;
}

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