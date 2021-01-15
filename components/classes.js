var tColors = { // transparent colors
    Red : 'rgba(255,0,0,0)',
    Salmon : 'rgba(218,80,48,0)',
    LightSalmon : 'rgba(100,63,48,0)',
    Orange : 'rgba(100,76,48,0)',
    Yellow : 'rgba(100,100,48,0)',
    White : 'rgba(99,100,78,0)',
    LightCyan : 'rgba(78,99,100,0)'
}

class starship {
    constructor(x, y, color, name) {
        this.x = x;
        this.y = y;
        this.radius = 8;
        this.speedX = 0;
        this.speedY = 0;
        this.name = name;
        this.color = color;
        this.shooting = false;

        this.getPosition = function () {
            console.log(this.x + "-" + this.y);
        };

        this.addSpeed = function (vX, vY) {
            if (vX != 0 && vY != 0) {
                this.speedX += BASE_SPEED_DIAGONAL * vX;
                this.speedY += BASE_SPEED_DIAGONAL * vY;
            } else {
                this.speedX += BASE_SPEED * vX;
                this.speedY += BASE_SPEED * vY;
            }
        };

        this.moveRefresh = function () {
            if (Math.abs(this.speedX) <= MIN_SPEED) {
                this.speedX = 0;
            } else {
                this.speedX *= MOTOR_BRAKE;
            }

            if (Math.abs(this.speedY) <= MIN_SPEED) {
                this.speedY = 0;
            } else {
                this.speedY *= MOTOR_BRAKE;
            }

            this.x += this.speedX / SLOWLY;
            if (this.x > (WIN_WIDTH - this.radius)) {
                this.x = (WIN_WIDTH - this.radius);
                this.speedX = 0;
            } else if (this.x < this.radius) {
                this.x = this.radius;
                this.speedX = 0;
            }

            this.y += this.speedY / SLOWLY;
            if (this.y > (WIN_HEIGHT - this.radius)) {
                this.y = (WIN_HEIGHT - this.radius);
                this.speedY = 0;
            } else if (this.y < this.radius) {
                this.y = this.radius;
                this.speedY = 0;
            }
        };

        this.draw = function () {
            myStarship.moveRefresh();
            ctx.arc(Math.round(this.x), Math.round(this.y), this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = this.color;
            ctx.fill();

            if (this.shooting) {
                ctx.strokeStyle = 'red';
            } else {
                ctx.strokeStyle = 'lime';
            }
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.closePath();
        };
    }
}

class bullet {
    constructor(x, y, pX, pY) {
        this.x = x;
        this.y = y;
        this.radius = 2;
        this.outWindow = false;
        this.speedX = BULLET_SPEED * ((pX - this.x) / (Math.abs(pX - this.x) + Math.abs(pY - this.y)));
        this.speedY = BULLET_SPEED * ((pY - this.y) / (Math.abs(pX - this.x) + Math.abs(pY - this.y)));

        this.moveRefresh = function () {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > WIN_WIDTH || this.x < 0 || this.y > WIN_HEIGHT || this.y < 0) {
                this.outWindow = true;
            }
        };

        this.draw = function () {
            addStarsGravity(this);
            this.moveRefresh();
            ctx.arc(Math.round(this.x), Math.round(this.y), this.radius, 0, 2 * Math.PI, false);

            ctx.fillStyle = 'white';
            ctx.fill();

            ctx.beginPath();
            ctx.closePath();
        };
    }
}

class star {
    constructor(x, y, mass, distance, ang) {
        this.x = x;
        this.y = y;
        this.mass = mass; // mass = radius
        this.distance = distance;
        this.ang = ang;

        this.move = function () {
            this.ang -= 180/this.distance**2;
            this.x = bh.x + (this.distance * Math.cos(this.ang));
            this.y = bh.y + (this.distance * Math.sin(this.ang));
        }

        this.draw = function () {
            ctx.arc(Math.round(this.x), Math.round(this.y), Math.floor(this.mass), 0, Math.PI*2, false);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fill();

            ctx.beginPath();
            ctx.closePath();

            this.move();
        }

        this.blurDraw = function () {
            let radgrad = ctx.createRadialGradient(
                Math.round(this.x),
                Math.round(this.y),
                Math.round(this.mass * 0.5),
                Math.round(this.x),
                Math.round(this.y),
                Math.round(this.mass)
            );

            let r = 255;
            let g = 100;
            let b = 100;

            if (this.mass >= 27) { r = 180 }
            else if (this.mass >= 22) { r = 255 - Math.round(15*(this.mass-22)) }

            if (this.mass >= 17) { g = 255 } 
            else if (this.mass >= 10) { g = 101 + Math.round(22*(this.mass-10)) }

            if (this.mass >= 20) { b = 255 } 
            else if (this.mass >= 17) { b = 60 + Math.round(65*(this.mass-17)) }
            else if (this.mass >= 12) { b = 60 }
            else if (this.mass >= 10) { b = 100 - Math.round(20*(this.mass-17)) }

            radgrad.addColorStop(0, 'white');
            radgrad.addColorStop(0.3, String('rgba('+r+','+g+','+b+')'));
            radgrad.addColorStop(1, String('rgba('+r+','+g+','+b+',0)'));

            ctx.fillStyle = radgrad;
            ctx.fillRect(
                Math.round(this.x) - Math.round(this.mass),
                Math.round(this.y) - Math.round(this.mass),
                this.mass * 2,
                this.mass * 2
            );

            this.move();
        }
    }
}

class blackHole {
    constructor(x, y, width, height, img) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = img;    
        this.angle = 0;  
        this.mass = 30; 

        this.draw = function () {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle*Math.PI/180);
            ctx.drawImage(this.img, -this.width/2, -this.height/2, width, height);
            ctx.restore();

            this.angle -= 0.5;
        }
    }
}