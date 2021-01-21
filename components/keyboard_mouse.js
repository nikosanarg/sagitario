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
    let shotModule = distance(myStarship.x, myStarship.y, mouse.x, mouse.y);
    let distanceRatio = 13 / shotModule;
    let dx = (mouse.x - myStarship.x) * distanceRatio;
    let dy = (mouse.y - myStarship.y) * distanceRatio;
    var bulletObject = new bullet(myStarship.x + dx, myStarship.y + dy, mouse.x, mouse.y);
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
