//Счётчик попаданий
let score = 0;
// Звуковые файлы
let shot = new Audio(); // Создание аудио объекта
shot.src = "audio/shot2.mp3"; // Указание нужной записи
let enemyShot = new Audio(); // Создание аудио объекта
enemyShot.src = "audio/shot3.mp3"; // Указание нужной записи
let explosion = new Audio();
explosion.src = "audio/explosion.wav";
let engine = new Audio();
engine.src = "audio/engine.wav";
let go = new Audio();
go.src = "audio/go.wav";
let gameover = new Audio();
gameover.src = "audio/gameover.wav";

let gameZone = document.querySelector('.game-zone'),
    // Объявляем переменную плавности движения
    fps = 1000/60,
    // Определяем нашего игрока как объект
    player = {
        sprites: {
            top: 'images/tank-top.png',
            right: 'images/tank-right.png',
            left: 'images/tank-left.png',
            bottom: 'images/tank-bottom.png',
            death: 'images/explosion.png',
        },
        el: false,
        x : 200,
        y : 400,
        step: 10,
        run: false,
        side: 1,
        width: 112,
        height: 112,
        hp: 2,
        // 1-top, 2-right, 3-bottom, 4-right
    },
    bulletShot = {
        width: 14,
        height: 14,
    },
    bulletSpeed = 15,
    vrag = {
        sprites: {
            top: 'images/enemy-top.png',
            right: 'images/enemy-right.png',
            left: 'images/enemy-left.png',
            bottom: 'images/enemy-bottom.png',
            death: 'images/explosion.png',
        }
    },
    // Определяем интервалы и свойства для них
    ints = {
        run: false,
        bullet: false,
        enemy: false,
        generateEnemy: false,
        enemyShots: false,
    }

//конец игры
function gameOver() {
    setTimeout(() => gameover.play(), 1000)
    let gameOver = document.querySelector('.gameOver ');
    gameOver.classList.add('on');
};

//После потери жизни
function next() {

    player.hp -=1;

    let enemies = document.querySelectorAll('.enemy');
    for (elem of enemies) {
        elem.remove()
    }

    if(!!player.el){
        player.el.remove();
    }

    clearInterval(ints.run);
    clearInterval(ints.bullet);
    clearInterval(ints.enemy);
    clearInterval(ints.generateEnemy);
    if(player.hp === 0) {
        gameOver();
    }
    game();
};

// Делаем плавные движения для танка и снаряда
function interval() {
    ints.run = setInterval(() => {
        if(player.run) {
            switch (player.side) {
                case 1:
                    if(player.y > 0) {
                        player.y -= player.step;
                        if(!!player.el){
                            player.el.style.top = `${player.y}px`
                        }
                    }
                    break;
                case 2:
                    if(player.x < gameZone.getBoundingClientRect().right - player.width - 5)
                    {
                        player.x += player.step;
                        if(!!player.el){
                            player.el.style.left = `${player.x}px`
                        }
                    }
                    break;
                case 3:
                    if(player.y < gameZone.getBoundingClientRect().bottom-player.height - 5)
                        player.y += player.step;
                        if(!!player.el){
                            player.el.style.top = `${player.y}px`
                        }
                    break;
                case 4:
                    if(player.x > 0) {
                        player.x -= player.step;
                        if(!!player.el){
                            player.el.style.left = `${player.x}px`
                        }
                    }
                    break;
            }

        }
    }, fps);
    ints.bullet = setInterval(() => {
        let bullets = document.querySelectorAll('.bullet');
        bullets.forEach((bullet) => {

            let direction = bullet.getAttribute('direction');

            switch (direction) {
                case 'top':
                    if(bullet.getBoundingClientRect().top < 0 ) {
                        bullet.remove();
                    } else {
                        bullet.style.top = bullet.getBoundingClientRect().top - bulletSpeed + 'px';
                    }
                    break;
                case 'right':
                    if(bullet.getBoundingClientRect().right > gameZone.getBoundingClientRect().width) {
                        bullet.remove();
                    } else {
                        bullet.style.left = bullet.getBoundingClientRect().left + bulletSpeed + 'px';
                    }
                    break;
                case 'left':
                    if(bullet.getBoundingClientRect().right < 0) {
                        bullet.remove();
                    } else {
                        bullet.style.left = bullet.getBoundingClientRect().left - bulletSpeed + 'px';
                    }
                    break;
                case 'bottom':
                    if(bullet.getBoundingClientRect().bottom > gameZone.getBoundingClientRect().height) {
                        bullet.remove();
                    } else {
                        bullet.style.top = bullet.getBoundingClientRect().top + bulletSpeed + 'px';
                    }
                    break;


            }


        })
    }, fps);
    ints.enemy = setInterval (() => {

        let enemies = document.querySelectorAll('.enemy');
        let bullets = document.querySelectorAll('.bullet');



        enemies.forEach((enemy) => {
            //столкновение с пулей
            bullets.forEach((bullet) => {
                let direction = bullet.getAttribute('direction');

                if (['top', 'left', 'right','bottom'].includes(direction)) {

                    if (
                        bullet.getBoundingClientRect().top < enemy.getBoundingClientRect().bottom &&
                        bullet.getBoundingClientRect().bottom > enemy.getBoundingClientRect().top &&
                        bullet.getBoundingClientRect().right > enemy.getBoundingClientRect().left &&
                        bullet.getBoundingClientRect().left < enemy.getBoundingClientRect().right
                    ) {
                        explosion.play();
                        let enemyTop = enemy.getBoundingClientRect().top,
                            enemyLeft = enemy.getBoundingClientRect().left;
                        bullet.remove();
                        enemy.remove();
                        gameZone.innerHTML += `<div class='explosion' style = "top: ${enemyTop}px; left: ${enemyLeft}px;"></div>`;

                        score += 1;
                        document.querySelector('.count-box').innerText = score;

                        setTimeout(()=>{
                            let explosion = document.querySelector('.explosion');
                            explosion.remove();

                        }, 500)
                        player.el = document.querySelector('.tank')

                    }
                    if(!!player.el){
                        let playerPosTop = player.el.getBoundingClientRect().top,
                            playerPosLeft = player.el.getBoundingClientRect().left;

                        if (
                            bullet.getBoundingClientRect().top < player.el.getBoundingClientRect().bottom &&
                            bullet.getBoundingClientRect().bottom > player.el.getBoundingClientRect().top &&
                            bullet.getBoundingClientRect().right > player.el.getBoundingClientRect().left &&
                            bullet.getBoundingClientRect().left < player.el.getBoundingClientRect().right
                        ) {
                            explosion.play();
                            bullet.remove();
                            player.el.remove();
                            gameZone.innerHTML += `<div class='explosion' style = "top: ${playerPosTop}px; left: ${playerPosLeft}px;"></div>`;

                            setTimeout(()=>{
                                let explosion = document.querySelector('.explosion');
                                explosion.remove();
                                next();
                            }, 500)

                        }
                    }

                }



            });
            if(!!player.el){
                //столкновения с врагом
                let playerPosTop = player.el.getBoundingClientRect().top,
                    playerPosBottom = player.el.getBoundingClientRect().bottom,
                    playerPosLeft = player.el.getBoundingClientRect().left,
                    playerPosRight = player.el.getBoundingClientRect().right,
                    enemyPosTop = enemy.getBoundingClientRect().top,
                    enemyPosBottom = enemy.getBoundingClientRect().bottom,
                    enemyPosLeft = enemy.getBoundingClientRect().left,
                    enemyPosRight = enemy.getBoundingClientRect().right;


                if (playerPosTop <  enemyPosBottom &&
                    playerPosBottom >  enemyPosTop &&
                    playerPosRight >  enemyPosLeft &&
                    playerPosLeft < enemyPosRight ) {
                    explosion.play();
                    player.el.remove();
                    gameZone.innerHTML += `<div class='explosion' style = "top: ${playerPosTop}px; left: ${playerPosLeft}px;"></div>`;


                    setTimeout(()=>{

                        let explosion = document.querySelector('.explosion');
                        explosion.remove();
                        if(!!player.el){
                            player.el.remove();
                        }
                        next();
                    }, 500)




                };
            }





            //исчезновение врагов при достижении стенки
            let direction = enemy.getAttribute('direction');

            switch (direction) {
                case 'left':

                    if(enemy.getBoundingClientRect().left <= (-player.width)) {
                        enemy.remove();
                    } else {
                        enemy.style.left = enemy.getBoundingClientRect().left - 5 + 'px';
                    }
                    break;
                case 'right':
                    if(enemy.getBoundingClientRect().left >= gameZone.getBoundingClientRect().width - player.width) {
                        enemy.remove();
                    } else {
                        enemy.style.left =  enemy.getBoundingClientRect().left + 5 + 'px';
                    }
                    break;
                case 'top':
                    if(enemy.getBoundingClientRect().top <= 0) {
                        enemy.remove();
                    } else {
                        enemy.style.top =  enemy.getBoundingClientRect().top - 5 + 'px';
                    }
                    break;
                case 'bottom':
                    if(enemy.getBoundingClientRect().top >= gameZone.getBoundingClientRect().height) {
                        enemy.remove();
                    } else {
                        enemy.style.top =  enemy.getBoundingClientRect().top + 5 + 'px';
                    }
                    break;
            };




        });



    }, fps)
    ints.generateEnemy = setInterval(()=>{
        let direction = random(1,4);
        switch(direction){
            case 1: //enemy top
                gameZone.innerHTML += `<div class="enemy" direction="top" style ='width: 75px; height: 150px; background: url("${vrag.sprites.top}") center/cover ;top: ${gameZone.getBoundingClientRect().height - player.height}px; left: ${random(0,gameZone.getBoundingClientRect().width - player.width)}px;'></div>`;

                break;
            case 2: //enemy right
                gameZone.innerHTML += `<div class="enemy" direction="right" style ='width: 150px; height: 75px;background: url("${vrag.sprites.right}") center/cover ; top: ${random(0,gameZone.getBoundingClientRect().height - player.height)}px; left: 0'></div>`;
                break;
            case 3: //enemy bottom
                gameZone.innerHTML += `<div class="enemy" direction="bottom" style ='width: 75px; height: 150px;background: url("${vrag.sprites.bottom}") center/cover ; top: 0; left: ${random(0,gameZone.getBoundingClientRect().width - player.width)}px'></div>`;
                break;
            case 4: //enemy left
                gameZone.innerHTML += `<div class="enemy" direction="left" style ='width: 150px; height: 75px;background: url("${vrag.sprites.left}") center/cover ;top: ${random(0,gameZone.getBoundingClientRect().height - player.height)}px; left: ${gameZone.getBoundingClientRect().width - player.width}px;'></div>`;
                break;
        };


        player.el = document.querySelector('.tank')
    }, 3000);
    ints.enemyShots = setInterval(()=>{
        let enemies = document.querySelectorAll('.enemy');
        enemies.forEach((enemy) => {

            //исчезновение врагов при достижении стенки
            let direction = enemy.getAttribute('direction');

            switch (direction) {
                case 'left':
                    if(!!player.el) {
                        if (player.el.getBoundingClientRect().top+50 > enemy.getBoundingClientRect().top &&
                            player.el.getBoundingClientRect().top-50 < enemy.getBoundingClientRect().bottom &&
                            player.el.getBoundingClientRect().left< enemy.getBoundingClientRect().right
                        ) {
                            gameZone.innerHTML += `<div class="bullet enemy-bullet" direction="left"  style="left: ${enemy.getBoundingClientRect().left}px; top: ${enemy.getBoundingClientRect().top + enemy.getBoundingClientRect().height/2}px;"></div>`;
                            enemyShot.play();
                            player.el = document.querySelector('.tank');
                        }
                    }
                    break;
                case 'right':
                    if(!!player.el) {
                        if (player.el.getBoundingClientRect().top+50 > enemy.getBoundingClientRect().top &&
                            player.el.getBoundingClientRect().top-50 < enemy.getBoundingClientRect().bottom &&
                            player.el.getBoundingClientRect().left > enemy.getBoundingClientRect().right
                        ) {
                            gameZone.innerHTML += `<div class="bullet enemy-bullet" direction="right"  style="left: ${enemy.getBoundingClientRect().left + enemy.getBoundingClientRect().width}px; top: ${enemy.getBoundingClientRect().top+enemy.getBoundingClientRect().height/2}px;"></div>`;
                            enemyShot.play();
                            player.el = document.querySelector('.tank');
                        }
                    }

                    break;
                case 'top':
                    if(!!player.el) {
                        if (player.el.getBoundingClientRect().left+100 > enemy.getBoundingClientRect().left &&
                            player.el.getBoundingClientRect().right-100 < enemy.getBoundingClientRect().right &&
                            player.el.getBoundingClientRect().top < enemy.getBoundingClientRect().top
                        ) {
                            gameZone.innerHTML += `<div class="bullet enemy-bullet" direction="top"  style="left: ${enemy.getBoundingClientRect().left + enemy.getBoundingClientRect().width/2}px; top: ${enemy.getBoundingClientRect().top-enemy.getBoundingClientRect().height}px;"></div>`;
                            enemyShot.play();
                            player.el = document.querySelector('.tank');

                        }
                    }

                    break;
                case 'bottom':
                    if(!!player.el) {
                        if (player.el.getBoundingClientRect().left+100 > enemy.getBoundingClientRect().left &&
                            player.el.getBoundingClientRect().right-100 < enemy.getBoundingClientRect().right &&
                            player.el.getBoundingClientRect().top > enemy.getBoundingClientRect().top
                        ) {
                            gameZone.innerHTML += `<div class="bullet enemy-bullet" direction="bottom"  style="left: ${enemy.getBoundingClientRect().left + enemy.getBoundingClientRect().width/2}px; top: ${enemy.getBoundingClientRect().top+enemy.getBoundingClientRect().height}px;"></div>`;
                            enemyShot.play();
                            player.el = document.querySelector('.tank')

                        }
                    }
                    break;
            };




        });
    }, 800)
};


//Restart game
function restartGame() {
    location.reload();
}

// Определяем нашего игрока
function init() {
    if(player.hp == 0) {
        player.hp == 2
    }

    player.x = gameZone.getBoundingClientRect().width/2 - player.width;
    player.y = gameZone.getBoundingClientRect().height - player.height;
    gameZone.innerHTML += `<div class="tank" style="left: ${player.x}px; top: ${player.y - 10}px;"></div>`;
    player.el = document.querySelector('.tank');
    switch (player.hp) {
        case 2:
            document.querySelector('.life').innerHTML = `<img src="images/heart-full.png" alt="heart" class="life__img">`;
            break;
        case 1:
            document.querySelector('.life').innerHTML = `<img src="images/heart-half.png" alt="heart" class="life__img">`;
            break;
        case 0:
            document.querySelector('.life').innerHTML = `<img src="images/heart-empty.png" alt="heart" class="life__img">`;
            break;
    }
}

//Добавляем снаряд
function addBullet() {
    switch(player.side) {
        case 1:
            gameZone.innerHTML += `<div class="bullet" direction="top"  style="left: ${player.x+player.width/2 - bulletShot.width/2}px; top: ${player.y - 8}px;"></div>`;
            break;
        case 2:
            gameZone.innerHTML += `<div class="bullet" direction="right"  style="left: ${player.x + player.width}px; top: ${player.y + player.height/2 - bulletShot.height/2}px;"></div>`;
            break;
        case 3:
            gameZone.innerHTML += `<div class="bullet" direction="bottom"  style="left: ${player.x + player.width/2 - bulletShot.width/2}px; top: ${player.y + player.height+30}px;"></div>`;
            break;
        case 4:
            gameZone.innerHTML += `<div class="bullet" direction="left"  style="left: ${player.x-50}px; top: ${player.y + player.height/2 - bulletShot.height/2}px;"></div>`;
            break;

    }

    player.el = document.querySelector('.tank')

}

//Random enemies
function random(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min +1);
    return Math.round(rand);
}

// Controllers
function controllers() {
    document.addEventListener('keydown',(e) => {
        switch (e.keyCode) {
            case 38: //up
                if(!!player.el) {
                    player.el.style.backgroundImage = `url(${player.sprites.top})`;
                    player.run = true;
                    player.side = 1;
                    engine.play();
                }

                break;
            case 39: //right
                if(!!player.el) {
                    player.el.style.backgroundImage = `url(${player.sprites.right})`;
                    player.run = true;
                    player.side = 2;
                    engine.play();
                }
                break;
            case 40: //bottom
                if(!!player.el) {
                    player.el.style.backgroundImage = `url(${player.sprites.bottom})`;
                    player.run = true;
                    player.side = 3;
                    engine.play();
                }
                break;
            case 37: //left
                if(!!player.el) {
                player.el.style.backgroundImage = `url(${player.sprites.left})`;
                player.run = true;
                player.side = 4;
                engine.play();
                }
                break;
            case 32: //shot
                if(!!player.el){
                    addBullet();
                    shot.play();
                }
                break;
        }
    });
    document.addEventListener('keyup',(e) => {
        if([38,39,40,37].includes(e.keyCode))
            player.run = false;
    });
}

// Start game
function game () {
    controllers();
    init();
    interval();
};

