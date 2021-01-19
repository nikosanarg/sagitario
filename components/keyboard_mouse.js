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
