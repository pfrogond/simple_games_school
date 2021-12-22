const black = '#000000';
const white = '#FFFFFF';
const rect_side = 80;

function init(button) {
  if (document.getElementById('Tic_tac_toe_canvas') != null) {
    document.getElementById('Tic_tac_toe_canvas').remove();
  }

  window.canvas = document.createElement('canvas');
  canvas.id = 'Tic_tac_toe_canvas';
  canvas.width = 640;
  canvas.height = 640;

  let body = document.getElementById('main_body');
  body.appendChild(canvas);

  window.ctx = canvas.getContext('2d');

  console.clear();

  let start_x = 0;
  let start_y = 0;

  let row_even = false;
  let column_even = false;

  for(let i = 1; i <= 8; i++){
    for(let j = 1; j <= 8; j++){
      switch (row_even & column_even) {
        case row_even & column_even:
          drawRect(start_x, start_y, black);
          console.log('even even');
          break;
        case row_even & !column_even:
          drawRect(start_x, start_y, white)
          console.log('even odd');
          break;
        case !row_even & column_even:
          drawRect(start_x, start_y, black)
          console.log('odd even');
          break;
        default:
          drawRect(start_x, start_y, white);
          console.log('odd odd');
          break;
      }
      column_even = !column_even;
      start_x += rect_side;
    }
    row_even = !row_even;
    start_x = 0;
    start_y += rect_side;
  }
}

function drawRect(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, rect_side, rect_side);
}
