//globalni promenne
const black = '#000000';
const white = '#FFFFFF';
const red = '#FF0000';
const pink = '#FF0F99';
const blue = '#0000FF';
const azure = '#00FFFF';
const green = '#00FF00';
const rect_side = 40;
const dama_prefix = 'dama_game_';

let selected_stone = undefined;
let won = false;
let current_game = null;
let current_id = null;

function getButtonId(button) {
  current_id = button.id;
  init();
}

//inicializace hry
function init() {
  if (document.getElementById('dama_canvas') != null) {
    document.getElementById('dama_canvas').remove();
  }

  window.canvas = document.createElement('canvas');
  canvas.id = 'dama_canvas';
  canvas.width = 320;
  canvas.height = 320;
  canvas.addEventListener('click', click);

  let body = document.getElementById('canvas_place');
  body.appendChild(canvas);

  window.ctx = canvas.getContext('2d');

  window.side_red = [];
  window.side_blue = [];
  window.side_friendly = side_red;
  window.side_foe = side_blue;
  window.color_friendly = red;
  window.color_foe = blue;
  window.turn = 1;
  window.current_direction = rect_side;

  current_game = dama_prefix + current_id;

  for(let i = 0; i < 8; i++){
    for(let j = 0; j < 8; j++){
      if (
        (i % 2 == 0 && j % 2 == 0) ||
        (i % 2 == 1 && j % 2 == 1)
      ) {
        drawRect(j * rect_side, i * rect_side, white);
      } else {
        drawRect(j * rect_side, i * rect_side, black);
      }
    }
  }

  let game = JSON.parse(localStorage.getItem(current_game) || '[]');

  if (game.length > 0) {
    turn = game.length;
    won = game[0];
    for(let i = 1; i < game.length; i++){
      if (game[i].stone_color == red || game[i].stone_color == pink) {
        side_red.push(game[i]);
      } else {
        side_blue.push(game[i]);
      }
      drawCircle(game[i].stone_x, game[i].stone_y, game[i].stone_color);
    }
    if (turn % 2 == 1) {
      side_friendly = side_red;
      side_foe = side_blue;
    } else {
      side_friendly = side_blue;
      side_foe = side_red;
    }
  } else {
    initDeployment(0, red, side_red);
    initDeployment(5 * rect_side, blue, side_blue);
  }
}

//vykresleni ctverce
function drawRect(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, rect_side, rect_side);
}

//vykresleni kruhu
function drawCircle(x, y, color) {
  ctx.beginPath();
  ctx.arc(x + (rect_side / 2), y + (rect_side / 2), rect_side / 2 - 10, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

//pocatecni rozmisteni a vytvoreni hernich kamenu
function initDeployment(y, color, side) {
  for(let i = 0; i < 3; i++){
    for(let j = 0; j < 4; j++){
      switch (color) {
        case red:
          if (i % 2 == 0) {
            side.push(createStone(rect_side + (j * 2 * rect_side), y + (i * rect_side), color, 1));
          } else {
            side.push(createStone(j * 2 * rect_side, y + (i * rect_side), color, 1));
          }
          break;
        default:
          if (i % 2 == 0) {
            side.push(createStone(j * 2 * rect_side, y + (i * rect_side), color, 1));
          } else {
            side.push(createStone(rect_side + (j * 2 * rect_side), y + (i * rect_side), color, 1));
          }
      }
    }
  }
}

//vytvoreni herniho kamene a jeho vykresleni
function createStone(x, y, color, status) {
  drawCircle(x, y, color);

  return {
    stone_x: x,
    stone_y: y,
    stone_color: color,
    stone_status: status,
    stone_moves: []
  };
}

//logika kliknuti mysi
function click() {

  if (won == false) {
    let canvas_offset_left = canvas.offsetLeft + 5;
    let canvas_offset_top = canvas.offsetTop + 5;
    let click_x = event.clientX - canvas.width / 2 - rect_side;
    let click_y = event.clientY - canvas.height / 2 - rect_side;

    console.log(click_x);
    console.log(click_y);

    window.selected_x = null;
    window.selected_y = null;

    selected_x = Math.floor(click_x / rect_side);
    selected_x *= rect_side;

    selected_y = Math.floor(click_y / rect_side);
    selected_y *= rect_side;

    if (selected_stone != undefined) {
      hideMoves();
    }

    findStone(side_friendly);

    if (selected_stone != undefined) {
      switch (selected_stone.stone_status) {
        case 1:
          getMovesNormal();
          break;
        case 2:
          getMovesDama();
          break;
      }
      moveStone();
    }
  }
}

//vyhledani kamene dle kliknuti
function findStone(side) {
  let new_stone = side.find(element =>
    element.stone_x == selected_x &&
    element.stone_y == selected_y
  );

  if (new_stone != undefined) {
    selected_stone = new_stone;
  }
}

//zobrazeni potencialnich tahu
function getMovesNormal() {
  let obstruction_friendly = undefined;
  let obstruction_foe = undefined;

  selected_stone.stone_moves = [];

  for(let i = -1; i < 2; i+=2){
    obstruction_friendly = getObstruction(
      selected_stone.stone_x + (i * rect_side),
      selected_stone.stone_y + current_direction,
      side_friendly
    );
    obstruction_foe = getObstruction(
      selected_stone.stone_x + (i * rect_side),
      selected_stone.stone_y + current_direction,
      side_foe
    );

    if (
      obstruction_friendly == undefined &&
      obstruction_foe == undefined
    ) {
      selected_stone.stone_moves.push([
        selected_stone.stone_x + (i * rect_side),
        selected_stone.stone_y + current_direction]);
    }

    if (checkJump(
      selected_stone.stone_x + (2 * i * rect_side),
      selected_stone.stone_y + (2 * current_direction),
      obstruction_foe
    )) {
      selected_stone.stone_moves.push([selected_stone.stone_x + (2 * i * rect_side), selected_stone.stone_y + (2 * current_direction)]);
    }

    drawPossibleMoves();
  }
}

//vyhledani prekazek tahu
function getObstruction(x, y, side) {
  return (
    side.find(element =>
      element.stone_x == x &&
      element.stone_y == y
    )
  );
}

//skryti potencialnich tahu
function hideMoves() {
  for(let i = 0; i < selected_stone.stone_moves.length; i++){
    drawRect(selected_stone.stone_moves[i][0], selected_stone.stone_moves[i][1], black);
  }
}

//posunuti hraciho kamene
function moveStone() {
  let possible_move = selected_stone.stone_moves.find(element =>
    element[0] == selected_x &&
    element[1] == selected_y
  );

  if (possible_move != undefined) {
    let dx = Math.abs(possible_move[0] - selected_stone.stone_x) / (possible_move[0] - selected_stone.stone_x);
    let dy = Math.abs(possible_move[1] - selected_stone.stone_y) / (possible_move[1] - selected_stone.stone_y);
    let obstruction_foe = getObstruction(
      possible_move[0] - (dx * rect_side),
      possible_move[1] - (dy * rect_side),
      side_foe
    );
    hideMoves();
    drawRect(selected_stone.stone_x, selected_stone.stone_y, black);
    drawCircle(possible_move[0], possible_move[1], selected_stone.stone_color);
    if (checkJump(possible_move[0], possible_move[1], obstruction_foe)) {
      removeStone(obstruction_foe.stone_x, obstruction_foe.stone_y);
    }
    selected_stone.stone_x = possible_move[0];
    selected_stone.stone_y = possible_move[1];
    selected_stone.stone_moves = [];
    checkStatusChange();
    endTurn();
  }
}

//konec tahu
function endTurn() {
  if (side_foe.length > 0) {
    turn++;
    current_direction *= -1;
    selected_stone = undefined;

    if (turn % 2 == 1) {
      side_friendly = side_red;
      side_foe = side_blue;
      color_friendly = red;
      color_foe = blue;
    } else {
      side_friendly = side_blue;
      side_foe = side_red;
      color_friendly = blue;
      color_foe = red;
    }
    saveGame();
  } else {
    won = true;
  }

}

function removeStone(x, y) {
  let index = side_foe.findIndex(element =>
    element.stone_x == x &&
    element.stone_y == y
  );

  side_foe.splice(index, 1);
  drawRect(x, y, black);
}

function checkStatusChange() {
  switch (turn % 2) {
    case 1:
      if (selected_stone.stone_y == canvas.height - rect_side) {
        selected_stone.stone_status = 2;
        selected_stone.stone_color = pink;
      }
      break;
    case 0:
      if (selected_stone.stone_y == 0) {
        selected_stone.stone_status = 2;
        selected_stone.stone_color = azure;
      }
      break;
  }
  drawCircle(selected_stone.stone_x, selected_stone.stone_y, selected_stone.stone_color);
}

function getMovesDama() {
  let obstruction_friendly = undefined;
  let obstruction_foe = undefined;
  let next_move = [];
  let next_possible_moves = [];

  selected_stone.stone_moves = [];

  for(let i = 0; i < 4; i++){
    next_move[0] = selected_stone.stone_x;
    next_move[1] = selected_stone.stone_y;
    next_possible_moves = [];
    obstruction_friendly = undefined;
    obstruction_foe = undefined;

    do {
      switch (i) {
        case 0:
          next_move[0] += rect_side;
          next_move[1] -= rect_side;
          obstruction_friendly = getObstruction(next_move[0], next_move[1], side_friendly);
          obstruction_foe = getObstruction(next_move[0], next_move[1], side_foe);
          if (checkJump(next_move[0] + rect_side, next_move[1] - rect_side, obstruction_foe)) {
            selected_stone.stone_moves.push([next_move[0] + rect_side, next_move[1] - rect_side]);
          }
          break;
        case 1:
          next_move[0] += rect_side;
          next_move[1] += rect_side;
          obstruction_friendly = getObstruction(next_move[0], next_move[1], side_friendly);
          obstruction_foe = getObstruction(next_move[0], next_move[1], side_foe);
          if (checkJump(next_move[0] + rect_side, next_move[1] + rect_side, obstruction_foe)) {
            selected_stone.stone_moves.push([next_move[0] + rect_side, next_move[1] + rect_side]);
          }
          break;
        case 2:
          next_move[0] -= rect_side;
          next_move[1] += rect_side;
          obstruction_friendly = getObstruction(next_move[0], next_move[1], side_friendly);
          obstruction_foe = getObstruction(next_move[0], next_move[1], side_foe);
          if (checkJump(next_move[0] - rect_side, next_move[1] + rect_side, obstruction_foe)) {
            selected_stone.stone_moves.push([next_move[0] - rect_side, next_move[1] + rect_side]);
          }
          break;
        case 3:
          next_move[0] -= rect_side;
          next_move[1] -= rect_side;
          obstruction_friendly = getObstruction(next_move[0], next_move[1], side_friendly);
          obstruction_foe = getObstruction(next_move[0], next_move[1], side_foe);
          if (checkJump(next_move[0] - rect_side, next_move[1] - rect_side, obstruction_foe)) {
            selected_stone.stone_moves.push([next_move[0] - rect_side, next_move[1] - rect_side]);
          }
          break;
      }
      next_possible_moves.push([next_move[0], next_move[1]]);
    } while (
      next_move[0] >= 0 &&
      next_move[0] < canvas.width &&
      next_move[1] >= 0 &&
      next_move[1] < canvas.height &&
      obstruction_friendly == undefined &&
      obstruction_foe == undefined
    );

    if (next_possible_moves.length > 1) {
      next_possible_moves.splice(next_possible_moves.length - 1, 1);
      selected_stone.stone_moves.push(...next_possible_moves);
    }
  }
  drawPossibleMoves();
}

function checkJump(x, y, obstruction) {
  if (
    obstruction != undefined &&
    getObstruction(x, y, side_friendly) == undefined &&
    getObstruction(x, y, side_foe) == undefined
  ) {
    return true;
  } else {
    return false;
  }
}

function drawPossibleMoves() {
  for(let i = 0; i < selected_stone.stone_moves.length; i++){
    drawRect(selected_stone.stone_moves[i][0], selected_stone.stone_moves[i][1], green);
  }
}

function saveGame() {
  let stones = [];
  stones.push(won, ...side_friendly, ...side_foe);
  if (localStorage.getItem(current_game != null)) {
    localStorage.removeItem(current_game);
  }
  localStorage.setItem(current_game, JSON.stringify(stones));
}

function deleteGame() {
  if (current_game != null) {
    localStorage.removeItem(current_game);
    turn = 1;
    won = false;
    init();
  }
}
