const rect_side = 20;
const canvas_width = 32 * rect_side;
const canvas_height = 32 * rect_side;
const snake_start = [
  [canvas_width / 2, canvas_height / 2],
  [canvas_width / 2 + rect_side, canvas_height / 2],
  [canvas_width / 2 + rect_side * 2, canvas_height / 2],
  [canvas_width / 2 + rect_side * 3, canvas_height / 2]
];

const green = '#00FF00';

function init(button) {
  if (document.getElementById('snake_canvas') != null) {
    document.getElementById('snake_canvas').remove();
  }

  window.canvas = document.createElement('canvas');
  canvas.id = 'snake_canvas';
  canvas.width = canvas_width;
  canvas.height = canvas_height;

  let body = document.getElementById('main_body');
  body.appendChild(canvas);

  window.ctx = canvas.getContext('2d');

  window.snake = [];
  window.direction = [-1 * rect_side, 0];
  window.saved = false;
  window.last_key_down = null;

  if (saved) {

  } else {
    snake = [...snake_start];
  }

  document.addEventListener('keydown', changeDir);

  setTimeout(gameLoop, 1000);
}

function drawGrid() {
  for(let i = 0; i < canvas.height / rect_side ; i++){
    for(let j = 0; j < canvas.width / rect_side; j++){
      ctx.strokeRect(j * rect_side, i * rect_side, rect_side, rect_side);
    }
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawRect(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, rect_side, rect_side);
}

function moveSnake() {
  snake.unshift([snake[0][0] + direction[0], snake[0][1] + direction[1]]);
  snake.pop();
  for(let i = 0; i < snake.length; i++){
    drawRect(snake[i][0], snake[i][1], green);
  }
}

function changeDir(key_down) {
  key_code = key_down.keyCode;
  let new_dir = [];
  let new_key_down = null;
  switch (key_code) {
    case 87:
      new_dir[0] = 0;
      new_dir[1] = -1 * rect_side;
      new_key_down = 1;
      break;
    case 83:
      new_dir[0] = 0;
      new_dir[1] = rect_side;
      new_key_down = -1;
      break;
    case 65:
      new_dir[0] = -1 * rect_side;
      new_dir[1] = 0;
      new_key_down = 2;
      break;
    case 68:
      new_dir[0] = rect_side;
      new_dir[1] = 0;
      new_key_down = -2;
      break;
  }
  if (last_key_down != new_key_down * -1) {
    direction[0] = new_dir[0];
    direction[1] = new_dir[1];
    last_key_down = new_key_down;
  }
}

function gameLoop() {
  setInterval(
    function () {
      clearCanvas();
      drawGrid();
      moveSnake();
    },
    500
  );
}
