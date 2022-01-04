//nekolik globalnich promennych
let ttt_prefix = 'ttt_game_';
let turn = 1;
let win_number = 4;
let won = false;
let current_game = null;
let current_id = null;

const rect_side = 40;
const amber = '#FFBF00';
const black = '#000000';
const color_cross = '#FF0000';
const color_circle = '#0000FF';

function getButtonId(button) {
  current_id = button.id;
  init();
}

//inicializace hry, popr. nacteni ulozene pozice
function init() {
  //smazani a znovu vytvoreni canvasu
  if (document.getElementById('Tic_tac_toe_canvas') != null) {
    document.getElementById('Tic_tac_toe_canvas').remove();
  }

  window.canvas = document.createElement('canvas');
  canvas.id = 'Tic_tac_toe_canvas';
  canvas.width = 12 * rect_side;
  canvas.height = 12 * rect_side;
  canvas.addEventListener('click', addShape);

  let content = document.getElementById('canvas_place');
  content.appendChild(canvas);

  window.ctx = canvas.getContext('2d');

  let num_of_rects_horizontal = 12;
  let num_of_rects_vertical = 12;
  let start_x = 0;
  let start_y = 0;
  let id = 0;
  let current = undefined;

  window.rects = [];
  window.filled_rects = [];
  window.canvas_bounding = canvas.getBoundingClientRect();

  current_game = ttt_prefix + current_id;
  turn = 1;
  won = false;

  //nacteni ulozene hry
  window.game = JSON.parse(localStorage.getItem(current_game) || '[]');

  //vykresleni plochy
  for (var i = 0; i < num_of_rects_horizontal; i++) {
    for (var j = 0; j < num_of_rects_vertical; j++) {
      current = game.find(element => element.rect_id == id);
      if (game.length > 0 && current != undefined) {
        rects.push(createRect(id, current.pos_x, current.pos_y, current.filled, current.color));
      } else {
        rects.push(createRect(id, start_x, start_y, 0, null));
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

//tvorba jednoho ctverecku plochy
function createRect(id, x, y, filled, color) {
  ctx.lineWidth = 3;
  ctx.strokeStyle = black;
  ctx.strokeRect(x, y, rect_side, rect_side);
  switch (filled) {
    case 1:
      drawCross(x, y, color);
      break;
    case 2:
      drawCircle(x, y, color);
      break;
  }
  return {
    rect_id: id,
    pos_x: x,
    pos_y: y,
    width: rect_side,
    height: rect_side,
    filled: filled,
    color: color
  };
}

//pridani noveho tvaru
function addShape() {
  //ocisteni souradnic kliku od offsetu herniho pole
  if (won == false) {
    let canvas_offset_left = canvas.offsetLeft + 5;
    let canvas_offset_top = canvas.offsetTop + 5;
    let click_x = event.clientX - canvas_bounding.left - 5;
    let click_y = event.clientY - canvas_bounding.top - 5;

    window.rect_x = null;
    window.rect_y = null;

    rect_x = Math.floor(click_x / rect_side);
    rect_x *= rect_side;

    rect_y = Math.floor(click_y / rect_side);
    rect_y *= rect_side;

    //vyhledani prislusneho pole
    window.rect = rects.find(element =>
      element.pos_x == rect_x &&
      element.pos_y == rect_y
    );

    //vykresleni tvaru
    if (rect.filled == 0) {
      switch (turn % 2) {
        case 1:
          rect.filled = 1;
          rect.color = color_cross;
          drawCross(rect_x, rect_y, rect.color);
          break;
        case 0:
          rect.filled = 2;
          rect.color = color_circle;
          drawCircle(rect_x, rect_y, rect.color);
          break;
      }
      winCondition();
      saveGame();
      turn++;
    }
  }
}

//krizek
function drawCross(x, y, color) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + 5, y + 5);
  ctx.lineTo(x + rect_side - 5, y + rect_side - 5);
  ctx.stroke();
  ctx.moveTo(x + rect_side - 5, y + 5);
  ctx.lineTo(x + 5, y + rect_side - 5);
  ctx.stroke();
}

//kolecko
function drawCircle(x, y, color) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(x + (rect_side / 2), y + (rect_side / 2), rect_side / 2 - 5, 0, 2 * Math.PI)
  ctx.stroke();
}

//overeni vitezstvi
function winCondition() {
  console.clear();
  checkLine(1, 0);
  checkLine(0, 1);
  checkLine(1, 1);
  checkLine(1, -1);
}

function checkNext(x, y) {
  return (
    rects.find(element =>
      element.pos_x == x &&
      element.pos_y == y &&
      element.filled == rect.filled
    )
  );
}

function checkWinNumber(count) {
  if (count == win_number) {
    won = true;
    switch (turn % 2) {
      case 0:
        rects_in_line.forEach((item, i) => {
          rects_in_line[i].color = amber;
          drawCircle(rects_in_line[i].pos_x, rects_in_line[i].pos_y, rects_in_line[i].color);
        });
        break;
      case 1:
        rects_in_line.forEach((item, i) => {
          rects_in_line[i].color = amber;
          drawCross(rects_in_line[i].pos_x, rects_in_line[i].pos_y, rects_in_line[i].color);
        });
        break;
    }
  }
}

function checkLine(dx, dy) {
  if (!won) {
    let found = 1;
    let next = true;
    let next_x = rect.pos_x;
    let next_y = rect.pos_y;
    let checked_rect = undefined;

    window.rects_in_line = [rect];

    for(let i = -1; i < 2; i+=2){
      do {
        next_x += dx * i * rect_side;
        next_y += dy * i * rect_side;
        checked_rect = checkNext(next_x, next_y)
        if (checked_rect != undefined) {
          found++;
          rects_in_line.push(checked_rect);
          checkWinNumber(found);
        } else {
          next = false;
        }
      } while (next && !won);
      next_x = rect.pos_x;
      next_y = rect.pos_y;
      next = true;
    }
  }
}

//ulozeni a prepsani hry pokud uz existuje se stejnym nazvem
function saveGame() {
  filled_rects.push(rect);
  filled_rects[0] = won;
  if (localStorage.getItem(current_game != null)) {
    localStorage.removeItem(current_game);
  }
  localStorage.setItem(current_game, JSON.stringify(filled_rects));
}

function deleteGame() {
  if (current_game != null) {
    localStorage.removeItem(current_game);
    turn = 1;
    won = false;
    init();
  }
}
