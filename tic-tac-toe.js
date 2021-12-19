//inicializace hry
function init() {
  //inicializace canvasu
  window.canvas = document.getElementById('Tic_tac_toe_canvas');
  window.ctx = canvas.getContext('2d');

  //zakladni promenne
  window.canvas_width = canvas.width;
  window.canvas_height = canvas.height;
  window.rect_side = 50;
  window.num_of_rects_horizontal = canvas_width / rect_side;
  window.num_of_rects_vertical = canvas_height / rect_side;
  window.start_x = 0;
  window.start_y = 0;

  window.turn = 1;
  window.win_number = 4;
  window.won = false;

  window.rects = [];

  //vykresleni mrizky
  for (var i = 0; i < num_of_rects_vertical; i++) {
    for (var j = 0; j < num_of_rects_horizontal; j++) {
      ctx.strokeRect(start_x, start_y, rect_side, rect_side);
      rects.push({
        pos_x: start_x,
        pos_y: start_y,
        width: rect_side,
        height: rect_side,
        filled: 0
      });
      start_x += rect_side;
    }
    start_x = 0;
    start_y += rect_side;
  }
}

//pridani tvaru
function addShape() {
  //ocisteni souradnic kliku od offsetu herniho pole
  let canvas_offset_left = canvas.offsetLeft;
  let canvas_offset_top = canvas.offsetTop;
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
      drawCircle();
      rect.filled = 2;
    } else {
      drawCross();
      rect.filled = 1;
    }
    turn++;
    winCondition();
  }
}

//krizek
function drawCross() {
  ctx.moveTo(rect.pos_x + 5, rect.pos_y + 5);
  ctx.lineTo(rect.pos_x + rect_side - 5, rect.pos_y + rect_side - 5);
  ctx.stroke();
  ctx.moveTo(rect.pos_x + rect_side - 5, rect.pos_y + 5);
  ctx.lineTo(rect.pos_x + 5, rect.pos_y + rect_side - 5);
  ctx.stroke();
}

//kolecko
function drawCircle() {
  ctx.beginPath();
  ctx.arc(rect.pos_x + (rect_side / 2), rect.pos_y + (rect_side / 2), rect_side / 2 - 5, 0, 2 * Math.PI)
  ctx.stroke();
}

//overovani podminek vitezstvi
function winCondition() {
  console.clear();
  if (
    checkHorizontal() ||
    checkVertical()
  ) {
    console.log('Won');
  }
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
    console.log(found);
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
    console.log(found);
  }
  return won;
}
