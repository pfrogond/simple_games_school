//nekolik globalnich promennych
let dama_prefix = 'dama_game_';
let turn = 1;
let won = false;
let current_game = null;
let player_1_set = [1,3,5,7,8,10,12,14,17,19,21,23];
let player_2_set = [40,42,44,46,49,51,53,55,56,58,60,62];
let stones = [1,3,5,7,17,19,21,23,8,10,12,14,40,42,44,46,56,58,60,62,49,51,53,55]

const rect_side = 80;
const playground_size = 8;

function init(button) {
  //smazani a znovu vytvoreni canvasu
  if (document.getElementById('Tic_tac_toe_canvas') != null) {
    document.getElementById('Tic_tac_toe_canvas').remove();
  }

  window.canvas = document.createElement('canvas');
  canvas.id = 'Tic_tac_toe_canvas';
  canvas.width = 640;
  canvas.height = 640;
  // canvas.addEventListener('click', addShape);

  let body = document.getElementById('main_body');
  body.appendChild(canvas);

  window.ctx = canvas.getContext('2d');

  console.clear();

  let start_x = 0;
  let start_y = 0;
  let id = 0;
  let current = undefined;

  window.rects = [];

  current_game = dama_prefix + button.id;
  turn = 1;
  won = false;

  window.game = JSON.parse(localStorage.getItem(current_game) || '[]');

  if (game.length == 0) {
    game = initDeployment();
  }

  for(let i = 0; i < playground_size; i++){
    for(let j = 0; j < playground_size; j++){
      current = game.find(element => element.rect_id == id);
      if (game.length > 0 && current != undefined) {
        rects.push(createRect(id, current.pos_x, current.pos_y, current.filled));
      } else {
        rects.push(createRect(id, start_x, start_y, 0));
      }
      id++;
      start_x += rect_side;
    }
    start_x = 0;
    start_y += rect_side;
  }

  if (game.length > 0) {
    turn = game.length + 1;
    won = game[0];
  }
}

function initDeployment() {
  let init_deployment = [];
  let x = 80;
  let y = 0;
  let aux_var = 0;

  //cervena
  for(let i = 0; i < 2; i++){
    for(let j = 0; j < 4; j++){
      init_deployment.push(
        createRectVirtual(stones[aux_var], x, y, 1)
      );
      x += 160;
      aux_var++;
    }
    x = 0;
    y += 160;
  }

  x = 0;
  y = 80;

  for(let k = 0; k < 4; k++){
    init_deployment.push(
      createRectVirtual(stones[aux_var], x, y, 1)
    );
    x += 160;
    aux_var++;
  }

  //modra
  x = 80;
  y = 400;

  for(let i = 0; i < 2; i++){
    for(let j = 0; j < 4; j++){
      init_deployment.push(
        createRectVirtual(stones[aux_var], x, y, 2)
      );
      x += 160;
      aux_var++;
    }
    x = 0;
    y += 160;
  }

  x = 0;
  y = 80;

  for(let k = 0; k < 4; k++){
    init_deployment.push(
      createRectVirtual(stones[aux_var], x, y, 2)
    );
    x += 160;
    aux_var++;
  }

  return init_deployment;
}

function createRectVirtual(id, x, y, filled) {
  return {
    rect_id: id,
    pos_x: x,
    pos_y: y,
    width: rect_side,
    height: rect_side,
    filled: filled
  };
}

function createRect(id, x, y, filled) {
  if (id % 2 == 0 && y % 160 == 0) {
    ctx.fillStyle = '#FFFFFF';
  } else if (id % 2 == 1 && y % 160 == 0) {
    ctx.fillStyle = '#000000';
  } else if (id % 2 == 0 && y % 160 != 0) {
    ctx.fillStyle = '#000000';
  } else {
    ctx.fillStyle = '#FFFFFF';
  }
  console.log(id, y);
  ctx.fillRect(x, y, rect_side, rect_side);

  if (filled != 0) {
    drawStone(x, y, filled);
  }

  return {
    rect_id: id,
    pos_x: x,
    pos_y: y,
    width: rect_side,
    height: rect_side,
    filled: filled
  };
}

function drawStone(x, y, filled) {
  ctx.beginPath();
  ctx.arc(x + (rect_side / 2), y + (rect_side / 2), rect_side / 2 - 5, 0, 2 * Math.PI)
  if (filled == 1) {
    ctx.fillStyle = '#FF0000';
  } else if (filled == 2) {
    ctx.fillStyle = '#0000FF';
  }
  ctx.fill();
}
