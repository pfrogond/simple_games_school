//nekolik globalnich promennych
let ttt_prefix = 'ttt_game_';
let turn = 1;
let win_number = 4;
let won = false;
let current_game = null;

const rect_side = 50;

//inicializace hry, popr. nacteni ulozene pozice
function init(button) {
  //smazani a znovu vytvoreni canvasu
  if (document.getElementById('Tic_tac_toe_canvas') != null) {
    document.getElementById('Tic_tac_toe_canvas').remove();
  }

  window.canvas = document.createElement('canvas');
  canvas.id = 'Tic_tac_toe_canvas';
  canvas.width = 600;
  canvas.height = 600;
  canvas.addEventListener('click', addShape);

  let body = document.getElementById('main_body');
  body.appendChild(canvas);

  window.ctx = canvas.getContext('2d');

  console.clear();

  let num_of_rects_horizontal = 12;
  let num_of_rects_vertical = 12;
  let start_x = 0;
  let start_y = 0;
  let id = 0;
  let current = undefined;

  window.rects = [];

  current_game = ttt_prefix + button.id;
  turn = 1;
  won = false;

  console.log(current_game);

  //nacteni ulozene hry
  window.game = JSON.parse(localStorage.getItem(current_game) || '[]');

  //vykresleni plochy
  for (var i = 0; i < num_of_rects_horizontal; i++) {
    for (var j = 0; j < num_of_rects_vertical; j++) {
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

//tvorba jednoho ctverecku plochy
function createRect(id, x, y, filled) {
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, rect_side, rect_side);
  if (filled == 1) {
    drawCross(x, y);
  } else if (filled == 2) {
    drawCircle(x, y);
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

//pridani noveho tvaru
function addShape() {
  //ocisteni souradnic kliku od offsetu herniho pole
  if (!won) {
    let canvas_offset_left = canvas.offsetLeft + 5;
    let canvas_offset_top = canvas.offsetTop + 5;
    let click_x = event.clientX - canvas_offset_left;
    let click_y = event.clientY - canvas_offset_top;

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
      if (turn % 2 == 0) {
        drawCircle(rect_x, rect_y);
        rect.filled = 2;
      } else {
        drawCross(rect_x, rect_y);
        rect.filled = 1;
      }
      turn++;
      winCondition(rect.rect_id);
    }
    saveGame();
    if (won) {
      console.log(won);
    }
  }
}

//krizek
function drawCross(x, y) {
  ctx.lineWidth = 2;
  ctx.moveTo(x + 5, y + 5);
  ctx.lineTo(x + rect_side - 5, y + rect_side - 5);
  ctx.stroke();
  ctx.moveTo(x + rect_side - 5, y + 5);
  ctx.lineTo(x + 5, y + rect_side - 5);
  ctx.stroke();
  console.log('cross ' + ' ' + x + ' ' + y);
}

//kolecko
function drawCircle(x, y) {
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x + (rect_side / 2), y + (rect_side / 2), rect_side / 2 - 5, 0, 2 * Math.PI)
  ctx.stroke();
  console.log('circle' + ' ' + x + ' ' + y);
}

//overeni vitezstvi
function winCondition() {
  checkHorizontal();
  checkVertical();
  checkDiagonalUp();
  checkDiagonalDown();
}

//overeni horizontalnich souradnic
function checkHorizontal() {
  let found = 1;

  let line = rects.filter(element =>
    element.pos_y == rect.pos_y &&
    element.filled == rect.filled
  );

  let init_pos = line[0].pos_x;

  for (var i = 1; i < line.length; i++) {
    if (line[i].pos_x == init_pos + (i * rect_side)) {
      found++;
      if (found == win_number) {
        won = true;
        break;
      }
    } else {
      found = 1;
      init_pos = line[i].pos_x;
    }
  }
  return won;
}

//overeni vertikalnich souradnic
function checkVertical() {
  let found = 1;

  let line = rects.filter(element =>
    element.pos_x == rect.pos_x &&
    element.filled == rect.filled
  );

  let init_pos = line[0].pos_y;

  for (var i = 1; i < line.length; i++) {
    if (line[i].pos_y == init_pos + (i * rect_side)) {
      found++;
      if (found == win_number) {
        won = true;
        break;
      }
    } else {
      found = 1;
      init_pos = line[i].pos_y;
    }
  }
  return won;
}

//overeni diagonalnich klesajicich souradnic
function checkDiagonalDown() {
  let found = 1;
  let next = true;
  let checked_x = rect.pos_x - 50;
  let checked_y = rect.pos_y - 50;
  let checked_rect = null;

  while (checked_x >= 0 && checked_y >= 0 && next) {
    checked_rect = rects.find(element =>
      element.pos_x == checked_x &&
      element.pos_y == checked_y
    );
    if (checked_rect.filled == rect.filled) {
      found++;
      if (found == win_number) {
        won = true;
      }
      checked_x -= 50;
      checked_y -= 50;
    } else {
      next = false;
    }
  }

  if (!won) {
    next = true;
    checked_x = rect.pos_x + 50;
    checked_y = rect.pos_y + 50;

    while (checked_x < canvas.width && checked_y < canvas.height && next) {
      checked_rect = rects.find(element =>
        element.pos_x == checked_x &&
        element.pos_y == checked_y
      );
      if (checked_rect.filled == rect.filled) {
        found++;
        if (found == win_number) {
          won = true;
        }
        checked_x -= 50;
        checked_y -= 50;
      } else {
        next = false;
      }
    }
  }

  return won;
}

//overeni diagonalnich stoupajicich souradnic
function checkDiagonalUp() {
  let found = 1;
  let next = true;
  let checked_x = rect.pos_x + 50;
  let checked_y = rect.pos_y - 50;
  let checked_rect = null;

  while (checked_x < canvas.width && checked_y >= 0 && next) {
    checked_rect = rects.find(element =>
      element.pos_x == checked_x &&
      element.pos_y == checked_y
    );
    if (checked_rect.filled == rect.filled) {
      found++;
      if (found == win_number) {
        won = true;
      }
      checked_x += 50;
      checked_y -= 50;
    } else {
      next = false;
    }
  }

  if (!won) {
    next = true;
    checked_x = rect.pos_x - 50;
    checked_y = rect.pos_y + 50;

    while (checked_x >= 0 && checked_y < canvas.height && next) {
      checked_rect = rects.find(element =>
        element.pos_x == checked_x &&
        element.pos_y == checked_y
      );
      if (checked_rect.filled == rect.filled) {
        found++;
        if (found == win_number) {
          won = true;
        }
        checked_x -= 50;
        checked_y += 50;
      } else {
        next = false;
      }
    }
  }

  return won;
}

//ulozeni a prepsani hry pokud uz existuje se stejnym nazvem
function saveGame() {
  let filled_rects = rects.filter(element => element.filled != 0);
  filled_rects.unshift(won);
  if (localStorage.getItem(current_game != null)) {
    localStorage.removeItem(current_game);
  }
  localStorage.setItem(current_game, JSON.stringify(filled_rects));
}
