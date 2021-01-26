// general context configuration
var ON = false;
var GRID = true;
var MODE_PLAY = false;
var MODE_WALLPAPER = false;
var MODE_SANDBOX = false;
var ctx;
var fps = 60;
var WIN_WIDTH = 1200;
var WIN_HEIGHT = 600;
const VIDEO_FREQUENCY = 1000 / fps;
const GRID_SIZE = 60; // recommended: 30, ideal: 50

// general game configuration
const GAME_MINUTES = 5;
const GRAVITY_CONST = 50;

// starships general information
const BASE_SPEED = 0.5;
const MIN_SPEED = 0.1;
const MOTOR_BRAKE = 0.97;
const SLOWLY = 8;
const DIAGONAL_EQ_CONSTANT = 0.585784; // hardcoded for equivalence between linear vs diagonal motion
const BASE_SPEED_DIAGONAL = Math.sqrt(((DIAGONAL_EQ_CONSTANT * BASE_SPEED)**2)/2);

// stars general information
const STARS_QUANTITY = 5;
const STARS_MAX_MASS = 35;
const SUPERNOVA_BULLETS = 47;
const STAR_DAMAGE = 1.5;

// starships & star's supernovas bullets
const BULLET_SPEED = 8;
const BULLET_MASS = 0.4; // add this mass to star target
const BULLET_DAMAGE = 7; // reduce this life to starships

// quantity of background stars
const STARS_BG_QUANTITY = 100;

// quantity and creation range of stars surround black hole 
// {100 - 310} for game & sandbox
// {100 - 400} for wallpaper
var BH_MIN_DISTANCE = 100;
var BH_MAX_DISTANCE = 310;