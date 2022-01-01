const canvas_width = 320;
const canvas_height = 480;
const rect_side = 20;
const canvas_width_center = canvas_width / 2;
const canvas_rows = canvas_height / rect_side;
const canvas_columns = canvas_width / rect_side;

const light_gray = '#bababa';
const white = '#ffffff';
const azure = '#00ffff';
const black = '#000000';
const yellow = '#ffff00';
const magenta = '#ff00ff';
const orange = '#ff8000';
const green = '#00ff00';
const red = '#ff0000';
const blue = '#0000ff';

const LEFT_KEY = 65;
const RIGHT_KEY = 68;
const ROTATE_KEY = 87;
const DOWN_KEY = 83;

let pile = [];
let pile_height = canvas_height - rect_side;
let normal_falling_velocity = 400;
let fast_falling_velocity = 100;
let current_falling_velocity = normal_falling_velocity;

document.addEventListener('keydown', userInput);

document.addEventListener('keyup', slowDown);

class Tetromino {
  constructor(shape) {
    this.shape = JSON.parse(JSON.stringify(shape));
    this.lowest_y = this.findLowestY();
    this.sides_x = this.findSidesX();
    this.center = this.findCenter();
  }

  draw() {
    this.shape.coordinates.forEach((item) => {
      drawRect(item[0], item[1], this.shape.color, black);
    });
  }

  findLowestY() {
    let y = this.shape.coordinates[0][1];

    this.shape.coordinates.forEach((item) => {
      if (item[1] > y) {
        y = item[1];
      }
    });

    return y;
  }

  findSidesX() {
    let x_left = this.shape.coordinates[0][0];
    let x_right = this.shape.coordinates[0][0];

    this.shape.coordinates.forEach((item) => {
      if (item[0] < x_left) {
        x_left = item[0];
      } else if (item[0] > x_right) {
        x_right = item[0];
      }
    });

    return {x_left: x_left, x_right: x_right};
  }

  checkPile() {
    let found = false;

    if (this.lowest_y >= pile_height - rect_side) {
      for(let i = 0; i < this.shape.coordinates.length; i++){
        for(let j = 0; j < pile.length; j++){
          if (this.shape.coordinates[i][0] == pile[j].x && this.shape.coordinates[i][1] == pile[j].y - rect_side) {
            found = true;
            break;
          }
        }
        if (found) {
          break;
        }
      }
    }

    return !found;
  }

  fall() {
    if (this.lowest_y < canvas_height - rect_side && this.checkPile()) {
      for(let i = 0; i < 2; i++){
        this.shape.coordinates.forEach((item) => {
          item[1] += rect_side / 2;
        });
        drawGrid();
        drawPile();
        this.draw();
      }
      this.lowest_y = this.findLowestY();
      this.center = this.findCenter();
    } else {
      addToPile(this.shape.coordinates, this.shape.color);
      removeRows();
      current_shape = new Tetromino(pickShape());
    }
  }

  move(direction) {
    if (this.sides_x.x_left + direction > -rect_side && this.sides_x.x_right + direction < canvas_width) {
      for(let i = 0; i < 2; i++){
        this.shape.coordinates.forEach((item) => {
          item[0] += direction / 2;
        });
        drawGrid();
        drawPile();
        this.draw();
      }
      this.sides_x = this.findSidesX();
      this.center = this.findCenter();
    }
  }

  findCenter() {
    let x = 0;
    let y = 0;

    this.shape.coordinates.forEach((item) => {
      x += item[0];
      y += item[1];
    });
    x = x / 4 - x / 4 % rect_side + rect_side;
    y = y / 4 - y / 4 % rect_side;

    return {x: x, y: y};
  }

  rotate() {
    let temp_x = null;

    drawGrid();
    drawPile();

    this.shape.coordinates.forEach((item) => {
      temp_x = (item[0] - this.center.x) * Math.cos(Math.PI / 2) - (item[1] - this.center.y) * Math.sin(Math.PI / 2) + this.center.x;
      item[1] = (item[0] - this.center.x) * Math.sin(Math.PI / 2) + (item[1] - this.center.y) * Math.cos(Math.PI / 2) + this.center.y;
      item[0] = temp_x;
    });
    this.lowest_y = this.findLowestY();
    this.sides_x = this.findSidesX();
    if (this.sides_x.x_left < 0) {
      do {
        this.move(rect_side);
      } while (this.sides_x.x_left < 0);
    } else if (this.sides_x.x_right > canvas_width) {
      do {
        this.move(-rect_side);
      } while (this.sides_x.x_right);
    }
    this.draw();
    this.center = this.findCenter();
  }
}

const shapes = [
  straight = {
    coordinates: [
      [canvas_width_center - 2 * rect_side, 0],
      [canvas_width_center - rect_side, 0],
      [canvas_width_center, 0],
      [canvas_width_center + rect_side, 0]
    ],
    color: azure
  },
  square = {
    coordinates: [
      [canvas_width_center - rect_side, 0],
      [canvas_width_center, 0],
      [canvas_width_center - rect_side, rect_side],
      [canvas_width_center, rect_side]
    ],
    color: yellow
  },
  t = {
    coordinates: [
      [canvas_width_center - rect_side, 0],
      [canvas_width_center, 0],
      [canvas_width_center + rect_side, 0],
      [canvas_width_center, rect_side]
    ],
    color: magenta
  },
  el = {
    coordinates: [
      [canvas_width_center + rect_side, 0],
      [canvas_width_center - rect_side, rect_side],
      [canvas_width_center, rect_side],
      [canvas_width_center + rect_side, rect_side]
    ],
    color: orange
  },
  el_inv = {
    coordinates: [
      [canvas_width_center - rect_side, 0],
      [canvas_width_center - rect_side, rect_side],
      [canvas_width_center, rect_side],
      [canvas_width_center + rect_side, rect_side]
    ],
    color: blue
  },
  // skew = {
  //   coordinates: [
  //     [canvas_width_center, 0],
  //     [canvas_width_center + rect_side, 0],
  //     [canvas_width_center - rect_side, rect_side],
  //     [canvas_width_center, rect_side]
  //   ],
  //   color: green
  // },
  // skew_inv = {
  //   coordinates: [
  //     [canvas_width_center - rect_side, 0],
  //     [canvas_width_center, 0],
  //     [canvas_width_center, rect_side],
  //     [canvas_width_center + rect_side, rect_side]
  //   ],
  //   color: red
  // }
];

let current_shape = new Tetromino(pickShape());

function initTetris() {
  if (document.getElementById('tetris_canvas') != null) {
    document.getElementById('tetris_canvas').remove();
  }

  window.canvas = document.createElement('canvas');
  canvas.id = 'tetris_canvas';
  canvas.width = canvas_width;
  canvas.height = canvas_height;

  let body = document.getElementById('canvas_place');
  body.appendChild(canvas);

  window.ctx = canvas.getContext('2d');

  console.clear();

  current_shape = new Tetromino(pickShape());

  console.log(canvas_columns);

  gameLoop();
}

function drawGrid() {
  for(let i = 0; i < canvas_height / rect_side; i++){
    for(let j = 0; j < canvas_width / rect_side; j++){
      drawRect(j * rect_side, i * rect_side, white, light_gray);
    }
  }
}

function drawRect(x, y, color, stroke) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, rect_side, rect_side);
  ctx.beginPath();
  ctx.strokeStyle = stroke;
  ctx.strokeRect(x, y, rect_side, rect_side);
}

function drawPile() {
  pile.forEach((item) => {
    drawRect(item.x, item.y, item.color, black);
  });
}

function addToPile(array, color) {
  array.forEach((item) => {
    pile.push({x: item[0], y: item[1], color: color});
    if (item[1] < pile_height) {
      pile_height = item[1];
    }
  });
}

function pickShape() {
  return shapes[Math.floor(Math.random() * shapes.length)];
}

function userInput(event) {
  let key_pressed = event.keyCode;

  switch (key_pressed) {
    case LEFT_KEY:
      current_shape.move(-rect_side);
      break;
    case RIGHT_KEY:
      current_shape.move(rect_side);
      break;
    case ROTATE_KEY:
      current_shape.rotate();
      break;
    case DOWN_KEY:
      current_falling_velocity = fast_falling_velocity;
      break;
  }
}

function slowDown(event) {
  let key_up = event.keyCode;
  if (key_up == DOWN_KEY) {
    current_falling_velocity = normal_falling_velocity;
  }
}

function removeRows() {
  let above = [];
  let below = [];
  let current_y = canvas_height - rect_side;
  let pile_rows = (canvas_height - pile_height) / rect_side;

  for(let i = 0; i < pile_rows; i++){
    if (pile.filter(element => element.y == current_y).length == canvas_columns) {
      pile = pile.filter(element => element.y != current_y);
      above = pile.filter(element => element.y < current_y);
      above.forEach((item) => {
        item.y += rect_side;
      });
      below = pile.filter(element => element.y > current_y);
      pile = above.concat(below);
      pile_height += rect_side;
      drawPile();
      removeRows();
    }
    current_y -= rect_side;
  }
}

function gameLoop() {

  function callback() {
    drawGrid();
    current_shape.fall();
    drawPile();
    setTimeout(callback, current_falling_velocity);
  }

  setTimeout(callback, current_falling_velocity);
}
