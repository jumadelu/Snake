// Canvas constants 
const PLAYSCREEN = document.getElementById('canvas');
const CTX = canvas.getContext('2d');
const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 480;

// matchfield
const ROWS = 20;
const COLS = 20;

// Snake variables
let cellWidth = CANVAS_WIDTH / COLS;
let cellHeight = CANVAS_HEIGHT / ROWS;
let snakeColor = 'ivory';
let snake = [
    {
        x: 5,
        y: 4
    }
];
let snakeDirection = 'right';

// Controller keycodes
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;

// Food 
let food = {};
let noAvailableFood = true;
let foodColor = 'red';
let foodCollected = false;
placeFood(); // calculate random position of food


// main draw function
function draw() {
    // clear canvas
    CTX.fillStyle = 'black';
    CTX.clearRect(0, 0, canvas.width, canvas.height);
    
    // draw snake
    CTX.fillStyle = snakeColor;
    snake.forEach(part => add(part.x, part.y));

    // draw food
    CTX.fillStyle = foodColor;
    add(food.x, food.y);

    // draw loop
    requestAnimationFrame(draw);
}


// draw cell for snake and food
function add(x, y) {
    CTX.fillRect(x * cellWidth, y * cellHeight, cellWidth -1 , cellHeight - 1);
    CTX.stroke();
}

// Food random position
function placeFood() {
    let randomFoodX = Math.floor(Math.random() * ROWS);
    let randomFoodY = Math.floor(Math.random() * COLS);
    food = {
        x: randomFoodX,
        y: randomFoodY
    };
}

// Keyboard
function ctrl(event) {
    let pressedKey = event.keyCode;
    if (pressedKey == LEFT) {
        snakeDirection = 'left';
    } 
    if (pressedKey == RIGHT) {
        snakeDirection = 'right';
    }
    if (pressedKey == UP) {
        snakeDirection = 'up';
    } 
    if (pressedKey == DOWN) {
        snakeDirection = 'down';
    }
} 

// shift the entire snake saved in json
function shiftSnake() {
    for (let i = snake.length - 1; i > 0; i--) {
        const part = snake[i];
        const lastPart = snake[i - 1];
        part.x = lastPart.x;
        part.y = lastPart.y;
    }
}


// gameover function
function gameover() {

    // check if snake bit itself
    let firstPart = snake[0];
    let otherParts = snake.slice(1);
    let duplicate = otherParts.find(part => part.x == firstPart.x && part.y == firstPart.y);


    if (snake[0].x < 0 || snake[0].x > COLS ||
        snake[0].y < 0 || snake[0].y > ROWS ||
        duplicate) {
            placeFood();
            snakeDirection = 'right';
            snake = [
                {
                    x: 5,
                    y: 4
                }
            ];
        }
}


// Main gameloop
function gameloop() {
    gameover();

    // extend snake if food collected
    if (foodCollected) {
        snake = [{
            x: snake[0].x, 
            y: snake[0].y
        }, ...snake];

        foodCollected = false;
    }

    shiftSnake();

    // moving direction
    if (snakeDirection == 'right') {
        snake[0].x++;
    } 
    if (snakeDirection == 'left') {
        snake[0].x--;
    } 
    if (snakeDirection == 'up') {
        snake[0].y--;
    } 
    if (snakeDirection == 'down') {
        snake[0].y++;
    } 

    // check if food found
    if (snake[0].x == food.x && snake[0].y == food.y) {
        foodCollected = true;
        placeFood();
    }
}


document.addEventListener('keydown', ctrl);
draw();
setInterval(gameloop, 250); 
gameloop();

