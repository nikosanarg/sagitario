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
        let mass, newx, newy, dist, ang, newStar;
        mass = 1;
        newx = randomNumber(WIN_WIDTH);
        newy = randomNumber(WIN_HEIGHT);
        dist = distance(newx, newy, bh.x, bh.y);
        ang = getAngle(newx, newy, bh.x, bh.y);
        newStar = new star(newx, newy, mass, dist, ang);
        bgStars.push(newStar);
    }
}