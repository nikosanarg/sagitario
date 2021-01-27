function clearCanvas() {
    try {
        canvas.width = WIN_WIDTH;
        canvas.height = WIN_HEIGHT;
    } catch {
        return false;
    }
}

function drawTimeLeft(e) {
    ctx.font = "30px Goldman";
    ctx.fillStyle = "cyan";
    ctx.textAlign = "center";
    ctx.fillText(String(Math.round(e.msTime / VIDEO_FREQUENCY)), WIN_WIDTH/2, 50);
}

function drawLifeBar(e) {
    ctx.beginPath();
    ctx.lineWidth = "3";
    ctx.strokeStyle = "purple";
    ctx.rect(WIN_WIDTH/2 - 100, 10, 202, 15);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = "0";
    let r = 255 - Math.round(2.5 * e.life);;
    let g = Math.round(2.5 * e.life);
    ctx.fillStyle = 'rgb('+r+','+g+',0)';
    ctx.rect(WIN_WIDTH/2 - 99, 11, Math.max(0, Math.ceil(e.life) * 2), 13);
    ctx.fill();
}

function seeDamageWindow() {
    if (damageModal) {
        ctx.beginPath();
        ctx.lineWidth = "0";
        ctx.fillStyle = 'rgba(' + 255 + ', ' + 100 + ', 0, 0.05)';
        ctx.rect(0, 0, WIN_WIDTH, WIN_HEIGHT);
        ctx.fill();
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

function insideStar(e, isBullet = true) {
    for (let i=0; i<stars.length; i++) {
        let s = stars[i];
        if (distance(e.x, e.y, s.x, s.y) <= s.mass) {
            if (isBullet) s.mass += BULLET_MASS
            else { 
                e.life -= STAR_DAMAGE;
                damageModal = true;
            }
            return true;
        }   
    }
    if (distance(e.x, e.y, bh.x, bh.y) <= bh.mass/2) {
        if (!isBullet) { 
            e.life -= STAR_DAMAGE * 2;
            damageModal = true;
        }
        return true;
    } 
    return false;
}

function insideStarship(e) {
    for (let i=0; i<starships.length; i++) {
        let s = starships[i];
        if (distance(e.x, e.y, s.x, s.y) < s.radius) {
            s.life -= BULLET_DAMAGE;
            SOUND && s_impact.play();
            damageModal = true;
            return true;
        }   
    }
    return false;
}

function timeDilationNearStar(e) {
    let timeDilation = 0;
    for (let i=0; i<stars.length; i++) {
        let s = stars[i];
        if (distance(e.x, e.y, s.x, s.y) <= s.mass*4) {
            timeDilation += s.mass / 150;
        }   
    }
    if (distance(e.x, e.y, bh.x, bh.y) <= bh.mass*2) {
        timeDilation += bh.mass / 200;
    } 
    if (timeDilation > 0.25) timeDilation = 0.25;
    return timeDilation;
}

function starExplode(e) {
    e.mass = 8;
    SOUND && s_supernova.play();
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
    let mass, newx, newy, dist, ang, newStar, dNotOk, cont = 0;
    for (let i=0; i<cant; i++) {
        dNotOk = true;
        mass = 1;
        while (dNotOk) {
            newx = randomNumber(WIN_WIDTH);
            newy = randomNumber(WIN_HEIGHT);
            dist = distance(newx, newy, bh.x, bh.y);
            if (dist < 250 || cont > cant/3) {
                dNotOk = false;
            }
        }
        ang = getAngle(newx, newy, bh.x, bh.y);
        newStar = new star(newx, newy, mass, dist, ang);
        bgStars.push(newStar);
        cont++;
    }
}

function initDynGrid() {
    let colsLength = WIN_WIDTH/GRID_SIZE
    for (let i=0; i<=colsLength; i++) {
        let row = [];
        let rowsLength = WIN_HEIGHT/GRID_SIZE;
        for (let j=0; j<=rowsLength; j++) {
            row.push({x: i*GRID_SIZE, y: j*GRID_SIZE});
        }
        gridPoints.push(row);
    }
}

function calculateGridPointPosition(e) {
    let newX = 0;
    let newY = 0;
    let dist, dx, dy;
    for (let i=0; i<STARS_QUANTITY; i++) {
        s = stars[i];
        dx = e.x - s.x;
        dy = e.y - s.y;
        dist = Math.max(distance(e.x, e.y, s.x, s.y), s.mass*2.7);
        newX += -80*(s.mass**2)*((dx)/(Math.abs(dx)+Math.abs(dy)))/(dist**2);
        newY += -80*(s.mass**2)*((dy)/(Math.abs(dx)+Math.abs(dy)))/(dist**2);
    }
    dist = Math.max(distance(e.x, e.y, bh.x, bh.y), bh.mass);
    dx = e.x - bh.x;
    dy = e.y - bh.y;
    newX += -50*(bh.mass**2)*((dx)/(Math.abs(dx)+Math.abs(dy)))/(dist**2);
    newY += -50*(bh.mass**2)*((dy)/(Math.abs(dx)+Math.abs(dy)))/(dist**2);
    return {x: e.x + newX, y: e.y + newY};
}

function drawDynGrid() {
    let auxGrid = [];
    let colsLength = gridPoints.length - 1;
    for (let i=0; i<=colsLength; i++) {
        let auxRow = [];
        let rowsLength = gridPoints[i].length - 1;
        for (let j=0; j<=rowsLength; j++) {
            let pointPos = calculateGridPointPosition(gridPoints[i][j]);
            auxRow.push(pointPos);

            if (i > 0 && j > 0) {
                ctx.strokeStyle = 'rgba(100,255,100,0.15)';
                ctx.setLineDash([5, 5]);
                if (j != (gridPoints[i].length-1)) {
                    ctx.moveTo(pointPos.x, pointPos.y);
                    ctx.lineTo(auxGrid[i-1][j].x, auxGrid[i-1][j].y);
                    ctx.stroke();
                }
                if (i != (gridPoints.length-1)) {
                    ctx.moveTo(pointPos.x, pointPos.y);
                    ctx.lineTo(auxRow[j-1].x, auxRow[j-1].y);
                    ctx.stroke();
                }
            }
            ctx.beginPath();
            ctx.closePath();  
        }
        auxGrid.push(auxRow);
    }
    ctx.setLineDash([1, 0]);
}