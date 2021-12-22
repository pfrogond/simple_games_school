//globalni promenne
const black = '#000000';
const white = '#FFFFFF';
const red = '#FF0000';
const blue = '#0000FF';
const green = '#00FF00';
const rect_side = 80;

let selected_stone = undefined;
let selected_moves = [];

//inicializace hry
function init(button) {
  if (document.getElementById('Tic_tac_toe_canvas') != null) {
    document.getElementById('Tic_tac_toe_canvas').remove();
  }

  window.canvas = document.createElement('canvas');
  canvas.id = 'Tic_tac_toe_canvas';
  canvas.width = 640;
  canvas.height = 640;
  canvas.addEventListener('click', click);

  let body = document.getElementById('main_body');
  body.appendChild(canvas);

  window.ctx = canvas.getContext('2d');

  window.side_red = [];
  window.side_blue = [];
  window.turn = 1;

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
  initDeployment(400, blue, side_blue);

  side_blue.push(createStone(160, 240, blue, 1));
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
    stone_status: status
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

  if (turn % 2 == 1) {
    selected_stone = findStone(side_red);
  } else {
    selected_stone = findStone(side_blue);
  }

  if (selected_stone != undefined) {
    hideMoves();
    if (turn % 2 == 1) {
      showMoves(1 * rect_side, side_red, side_blue);
    } else {
      showMoves(-1 * rect_side, side_blue, side_red);
    }
  }
}

//vyhledani kamene dle kliknuti
function findStone(side) {
  return (
    side.find(element =>
      element.stone_x == selected_x &&
      element.stone_y == selected_y
    )
  );
}

//zobrazeni potencialnich tahu
function showMoves(direction, friendly, foe) {
  let obstruction_friendly = undefined;
  let obstruction_foe = undefined;

  for(let i = -1; i < 2; i+=2){
    obstruction_friendly = getObstruction(i, direction, friendly);
    obstruction_foe = getObstruction(i, direction, foe);

    if (obstruction_friendly == undefined && obstruction_foe == undefined) {
      drawRect(selected_stone.stone_x + (i * rect_side), selected_stone.stone_y + direction, green);
      selected_moves.push([selected_stone.stone_x + (i * rect_side), selected_stone.stone_y + direction]);
    } else if (obstruction_foe != undefined) {
      drawRect(selected_stone.stone_x + (2 * i * rect_side), selected_stone.stone_y + 2 * direction, green);
      selected_moves.push([selected_stone.stone_x + (2 * i * rect_side), selected_stone.stone_y + 2 * direction])
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
  for(let i = 0; i < selected_moves.length; i++){
    drawRect(selected_moves[i][0], selected_moves[i][1], black);
  }
  selected_moves = [];
}
