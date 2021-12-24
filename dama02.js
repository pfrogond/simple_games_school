//globalni promenne
const black = '#000000';
const white = '#FFFFFF';
const red = '#FF0000';
const pink = '#FF0F99';
const blue = '#0000FF';
const azure = '#00FFFF';
const green = '#00FF00';
const rect_side = 40;

let selected_stone = undefined;

//inicializace hry
function init(button) {
  if (document.getElementById('Tic_tac_toe_canvas') != null) {
    document.getElementById('Tic_tac_toe_canvas').remove();
  }

  window.canvas = document.createElement('canvas');
  canvas.id = 'Tic_tac_toe_canvas';
  canvas.width = 320;
  canvas.height = 320;
  canvas.addEventListener('click', click);

  let body = document.getElementById('main_body');
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

  console.clear();

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

  initDeployment(0, red, side_red);
  initDeployment(5 * rect_side, blue, side_blue);
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
            side.push(createStone(rect_side + (j * 2 * rect_side), y + (i * rect_side), color));
          } else {
            side.push(createStone(j * 2 * rect_side, y + (i * rect_side), color));
          }
          break;
        default:
          if (i % 2 == 0) {
            side.push(createStone(j * 2 * rect_side, y + (i * rect_side), color));
          } else {
            side.push(createStone(rect_side + (j * 2 * rect_side), y + (i * rect_side), color));
          }
      }
    }
  }
}

//vytvoreni herniho kamene a jeho vykresleni
function createStone(x, y, color) {
  drawCircle(x, y, color);

  return {
    stone_x: x,
    stone_y: y,
    stone_color: color,
    stone_status: 1,
    stone_moves: []
  };
}

//logika kliknuti mysi
function click() {
  let canvas_offset_left = canvas.offsetLeft + 5;
  let canvas_offset_top = canvas.offsetTop + 5;
  let click_x = event.clientX - canvas_offset_left;
  let click_y = event.clientY - canvas_offset_top;

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
    getMoves(current_direction, side_friendly, side_foe);
    moveStone();
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
function getMoves(direction, friendly, foe) {
  let obstruction_friendly = undefined;
  let obstruction_foe = undefined;

  for(let i = -1; i < 2; i+=2){
    obstruction_friendly = getObstruction(i, direction, friendly);
    obstruction_foe = getObstruction(i, direction, foe);

    if (
      obstruction_friendly == undefined &&
      obstruction_foe == undefined
    ) {
      drawRect(selected_stone.stone_x + (i * rect_side), selected_stone.stone_y + direction, green);
      selected_stone.stone_moves.push([
        selected_stone.stone_x + (i * rect_side),
        selected_stone.stone_y + direction]);
    } else if (
      obstruction_foe != undefined &&
      getObstruction(i * 2, direction * 2, friendly) == undefined &&
      getObstruction(i * 2, direction * 2, foe) == undefined
    ) {
      drawRect(selected_stone.stone_x + (2 * i * rect_side), selected_stone.stone_y + 2 * direction, green);
      selected_stone.stone_moves.push([
        selected_stone.stone_x + (2 * i * rect_side),
        selected_stone.stone_y + 2 * direction
      ]);
    }
  }
}

//vyhledani prekazek tahu
function getObstruction(variable, direction, side) {
  return (
    side.find(element =>
      element.stone_x == selected_stone.stone_x + (variable * rect_side) &&
      element.stone_y == selected_stone.stone_y + direction
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
    hideMoves();
    drawRect(selected_stone.stone_x, selected_stone.stone_y, black);
    drawCircle(possible_move[0], possible_move[1], selected_stone.stone_color);
    if (Math.abs(possible_move[0] - selected_stone.stone_x) > rect_side) {
      removeStone(
        selected_stone.stone_x + (possible_move[0] - selected_stone.stone_x) / 2,
        selected_stone.stone_y + current_direction
      );
    }
    selected_stone.stone_x = possible_move[0];
    selected_stone.stone_y = possible_move[1];
    selected_stone.stone_moves = [];
    checkStatusChange();
    console.log(selected_stone.stone_status);
    endTurn();
  }
}

//konec tahu
function endTurn() {
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
      if (selected_stone.stone_y == 7 * rect_side) {
        selected_stone.stone_status = 2;
        selected_stone.stone_color = pink;
      }
      break;
    case 2:
      if (selected_stone.stone_y == 0) {
        selected_stone.stone_status = 2;
        selected_stone.stone_color = azure;
      }
      break;
  }
  drawCircle(selected_stone.stone_x, selected_stone.stone_y, selected_stone.stone_color);
}
