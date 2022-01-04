function snake() {

  if (document.getElementById('snake_canvas') != null) {
    document.getElementById('snake_canvas').remove();
  }

  window.canvas = document.createElement('canvas');
  canvas.id = 'snake_canvas';
  canvas.width = 480;
  canvas.height = 480;

  let body = document.getElementById('canvas_place');
  body.appendChild(canvas);

  window.playGround_context = canvas.getContext('2d');

  //barvy herni plochy, hada a jidla
  const playGround_background = 'white';
  const playGround_border = 'black';
  const snake_background = 'lightblue';
  const snake_border = 'darkblue';
  const food_backgroud = 'lightgreen';
  const food_border = 'darkgreen';
  const bonus_food_background = 'red';
  const bonus_food_border = 'darkred';
  const barrier_background = 'lightgray';
  const barrier_border = 'darkgray';

  //startovni pozice a delky hada
  let snake = [
    {x: 200, y: 200},
    {x: 190, y: 200},
    {x: 180, y: 200},
    {x: 170, y: 200},
    {x: 160, y: 200}
  ];

  let dx = 10;
  let dy = 0;
  let food_x;
  let food_y;
  let bonusFood_x;
  let bonusFood_y;
  let bonusFood_on_map = 0;
  const bonusFood_time_on_map = 50;
  let bonusFood_timer = bonusFood_time_on_map;
  let score = 0;
  let velocity = 100;
  let changing_direction = false;
  let numberOfBarriers = 2;

  let barrier = [];

  //souradnice pro prekazky
  let barrier1 = [
    {x: 130, y: 120},
    {x: 140, y: 120},
    {x: 150, y: 120},
    {x: 160, y: 120},
    {x: 170, y: 120},
    {x: 180, y: 120},
    {x: 190, y: 120},
    {x: 200, y: 120},
    {x: 210, y: 120},
    {x: 220, y: 120},
    {x: 230, y: 120},
    {x: 240, y: 120},
    {x: 250, y: 120},
    {x: 260, y: 120},

    {x: 130, y: 280},
    {x: 140, y: 280},
    {x: 150, y: 280},
    {x: 160, y: 280},
    {x: 170, y: 280},
    {x: 180, y: 280},
    {x: 190, y: 280},
    {x: 200, y: 280},
    {x: 210, y: 280},
    {x: 220, y: 280},
    {x: 230, y: 280},
    {x: 240, y: 280},
    {x: 250, y: 280},
    {x: 260, y: 280}
  ];

  let barrier2 = [
    {x: 80, y: 80},
    {x: 80, y: 90},
    {x: 80, y: 100},
    {x: 90, y: 80},
    {x: 90, y: 100},
    {x: 100, y: 80},
    {x: 100, y: 90},
    {x: 100, y: 100},

    {x: 80, y: 300},
    {x: 80, y: 310},
    {x: 80, y: 320},
    {x: 90, y: 300},
    {x: 90, y: 320},
    {x: 100, y: 300},
    {x: 100, y: 310},
    {x: 100, y: 320},

    {x: 300, y: 80},
    {x: 300, y: 90},
    {x: 300, y: 100},
    {x: 310, y: 80},
    {x: 310, y: 100},
    {x: 320, y: 80},
    {x: 320, y: 90},
    {x: 320, y: 100},

    {x: 300, y: 300},
    {x: 300, y: 310},
    {x: 300, y: 320},
    {x: 310, y: 300},
    {x: 310, y: 320},
    {x: 320, y: 300},
    {x: 320, y: 310},
    {x: 320, y: 320}
  ];

  //"vycisteni" herni plochy pro novy snimek
  function clearCanvas() {
    playGround_context.fillStyle = playGround_background;
    playGround_context.fillRect(0, 0, playGround.width, playGround.height);
  }

  //nastaveni barvy hada
  function drawSnakePart(snakePart) {
    playGround_context.fillStyle = snake_background;
    playGround_context.strokeStyle = snake_border;
    playGround_context.fillRect(snakePart.x, snakePart.y, 10, 10);
    playGround_context.strokeRect(snakePart.x, snakePart.y, 10, 10);
  }

  //zobrazeni hada na herni plose
  function drawSnake() {
    snake.forEach(drawSnakePart);
  }

  //nastaveni hlavy a zakladniho posunu hada + rust pomoci vypusteni fce .pop() + pricitani score
  function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    const just_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
    const just_eaten_bonus_food = snake[0].x === bonusFood_x && snake[0].y === bonusFood_y;
    if (just_eaten_food) {
      score += 10;
      document.getElementById('score').innerHTML = score;
      generateFood();
    }
    else if (just_eaten_bonus_food) {
      score += 20;
      document.getElementById('score').innerHTML = score;
      bonusFood_on_map = 0;
      generateBonusFood();
    }
    else {
      snake.pop();
    }
  }

  //zmena pohybu hada (pomoci kodu klaves) + kontrola proti 180 otoceni
  function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const ALT_LEFT_KEY = 65;
    const ALT_RIGHT_KEY = 68;
    const ALT_UP_KEY = 87;
    const ALT_DOWN_KEY = 83;

    if (changing_direction) return;
    changing_direction = true;
    const keyPressed = event.keyCode;
    const goingLeft = dx === -10;
    const goingRight = dx === 10;
    const goingUp = dy === -10;
    const goingDown = dy === 10;

    if ((keyPressed === ALT_LEFT_KEY && !goingRight) || (keyPressed === LEFT_KEY && !goingRight)) {
      dx = -10;
      dy = 0;
    }
    if ((keyPressed === ALT_RIGHT_KEY && !goingLeft) || (keyPressed === RIGHT_KEY && !goingLeft)) {
      dx = 10;
      dy = 0;
    }
    if ((keyPressed === ALT_UP_KEY && !goingDown) || (keyPressed === UP_KEY && !goingDown)) {
      dx = 0;
      dy = -10;
    }
    if ((keyPressed === ALT_DOWN_KEY && !goingUp) || (keyPressed === DOWN_KEY && !goingUp)) {
      dx = 0;
      dy = 10;
    }
  }

  //kontrola srazky s ocasem, stenou a prekazkou
  function gameOver() {
    for (let i = 4; i < snake.length; i++) {
      const hit = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
      if (hit) {
        return true;
      }
    }
    for (let j = 0; j < barrier.length; j++) {
      const hit = snake[0].x === barrier[j].x && snake[0].y === barrier[j].y;
      if (hit) {
        return true;
      }
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > playGround.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > playGround.height - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
  }

  //generovani nahodnych souradnic pro jidlo na herni plose
  function randomFood(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 10) * 10;
  }

  //generovani jidla a kontrola zda se tam uz nenachazi had
  function generateFood() {
    food_x = randomFood(0, playGround.width - 10);
    food_y = randomFood(0, playGround.height - 10);
    snake.forEach(function isFoodOnSnake(part) {
      const food_on_snake = part.x == food_x && part.y == food_y;
      if (food_on_snake) generateFood();
    });
    barrier.forEach(function isFoodOnBarrier(part) {
      const food_on_barrier = part.x == food_x && part.y == food_y;
      if (food_on_barrier) generateFood();
    });
  }

  //vykresleni jidla na herni plose
  function drawFood() {
    playGround_context.fillStyle = food_backgroud;
    playGround_context.strokeStyle = food_border;
    playGround_context.fillRect(food_x, food_y, 10, 10);
    playGround_context.strokeRect(food_x, food_y, 10, 10);
  }

  //s urcitou sanci vygeneruje bonusove jidlo na herni plose
  function generateBonusFood() {
    let bonus_food_chance;

    bonus_food_chance = Math.floor(Math.random() * 300);
    if (bonusFood_on_map == 0) {
      if (bonus_food_chance >= 0 && bonus_food_chance < 10) {
        bonusFood_x = randomFood(0, playGround.width - 10);
        bonusFood_y = randomFood(0, playGround.height - 10);
        snake.forEach (function isBonusFoodOnSnake(part) {
          const bonus_food_on_snake = part.x == bonusFood_x && part.y == bonusFood_y;
          if (bonus_food_on_snake) generateBonusFood();
        });
        barrier.forEach (function isBonusFoodOnBarrier(part) {
          const bonus_food_on_barrier = part.x == bonusFood_x && part.y == bonusFood_y;
          if (bonus_food_on_barrier) generateBonusFood();
        });
        bonusFood_on_map = 1;
      }
    }
  }

  //po danou dobu vykresli bonusove jidlo a po vyprseni casu ho presune mimo herni plochu
  function drawBonusFood() {
    if (bonusFood_on_map == 1 && bonusFood_timer > 0) {
      playGround_context.fillStyle = bonus_food_background;
      playGround_context.strokeStyle = bonus_food_border;
      playGround_context.fillRect(bonusFood_x, bonusFood_y, 10, 10);
      playGround_context.strokeRect(bonusFood_x, bonusFood_y, 10, 10);
      bonusFood_timer -= 1;
    } else {
      bonusFood_on_map = 0;
      bonusFood_timer = bonusFood_time_on_map;
      bonusFood_x = -10;
      bonusFood_y = -10;
    }
  }

  //nahodne vybere jednu z nadefinovanych 'map' (barrier(1-n))
  function pickRandomBarrier() {
    let randomNumber = Math.round(Math.random() * numberOfBarriers) + 1;
    if (randomNumber == 1) {
      barrier = Array.from(barrier1);
    } else {
      barrier = Array.from(barrier2);
    }
  }

  //nastaveni barvy a pozice prekazky
  function drawBarrierPart(barrierPart) {
    playGround_context.fillStyle = barrier_background;
    playGround_context.strokeStyle = barrier_border;
    playGround_context.fillRect(barrierPart.x, barrierPart.y, 10, 10);
    playGround_context.strokeRect(barrierPart.x, barrierPart.y, 10, 10);
  }

  //zobrazeni prekazky na herni plose
  function drawBarrier() {
    barrier.forEach(drawBarrierPart);
  }

  //zrychlovani hada
  function acceleration() {
    if (velocity > 75) {
      velocity -= 0.1;
    }
    if (velocity > 50 && velocity <= 75) {
      velocity -= 0.05;
    }
    if (velocity > 25 && velocity <= 50) {
      velocity -= 0.025;
    }
    if (velocity == 25) {
      velocity = 25;
    }
    return velocity;
  }

  //prepne na hlavni menu
  function onEnd() {
    clearCanvas();
    document.getElementById('playGround').style.display = 'none';
    document.getElementById('fakeC').style.display = 'flex';
    document.getElementById('score').innerHTML = '0';
    document.removeEventListener('keydown', onEnd);
    return;
  }

  //herni smycka
  function main() {

    if (gameOver()) {
      document.addEventListener('keydown', onEnd);
      return;
    }
    changing_direction = false;

    setTimeout(function onTick() {
      clearCanvas();
      drawFood();
      generateBonusFood();
      drawBonusFood();
      moveSnake();
      drawSnake();
      drawBarrier();
      main();
    }, acceleration())
  }

  //spusteni hry
  main();

  //vygeneruje prvni pozici jidla
  generateFood();

  //vybere nahodnou 'mapu' pro nasledujici hru
  pickRandomBarrier();

  //odchyceni stisku klavesy
  document.addEventListener('keydown', changeDirection);
}
