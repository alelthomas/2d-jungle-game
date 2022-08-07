const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d"); //context
const gravity = 0.7;
let timer = 60;
let timerId;

const music = new Audio("./sounds/jungle-music.mp3");
music.volume = 0.1;
music.play();
const rainSound = new Audio("./sounds/jungle-rain.wav");
rainSound.play();

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: "./img/bgforest2.png"
})

const rain = new Sprite({
    position: {
        x: 0,
        y: 5
    },
    imageSrc: "./img/rain30.png",
    scale: 2.5,
    noFrames: 6
})

const rain_right = new Sprite({
    position: {
        x: 650,
        y: 5
    },
    imageSrc: "./img/rain30.png",
    scale: 2.5,
    noFrames: 6
})

const player = new Player({
    position: {
        x: -150,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: "./img/huntress/idle.png",
    noFrames: 8,
    scale: 3,
    offset: { //location within canvas
        x: 0,
        y: 160
    },
    sprites: {
        idle: {
            imageSrc: "./img/huntress/idle.png",
            noFrames: 8
        },
        run: {
            imageSrc: "./img/huntress/run.png",
            noFrames: 8
        },
        run_left: { //correct
            imageSrc: "./img/huntress/run-left.png",
            noFrames: 8
        },
        jump: {
            imageSrc: "./img/huntress/jump.png",
            noFrames: 2
        },
        fall: {
            imageSrc: "./img/huntress/fall.png",
            noFrames: 2
        },
        hit: {
            imageSrc: "./img/huntress/attack.png",
            noFrames: 5
        },
        attacked: {
            imageSrc: "./img/huntress/hit.png",
            noFrames: 3
        },
        dead: {
            imageSrc: "./img/huntress/dead.png",
            noFrames: 8
        }
    },
    attackRange: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    }
});

const player2 = new Player({
    position: {
        x: 750,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: "./img/hunter/idle.png",
    noFrames: 10, //blob: 4, reaper: 7
    scale: 2.6,
    offset: {
        x: 0,
        y: 82 //blob: -115, reaper: -50
    },
    sprites: {
        idle: {
            imageSrc: "./img/hunter/idle.png",
            noFrames: 10
        },
        run: {
            imageSrc: "./img/hunter/run.png",
            noFrames: 8
        },
        run_right: {
            imageSrc: "./img/hunter/run-right.png",
            noFrames: 8
        },
        hit: {
            imageSrc: "./img/hunter/attack.png",
            noFrames: 7
        },
        jump: {
            imageSrc: "./img/hunter/jump.png",
            noFrames: 3
        },
        fall: {
            imageSrc: "./img/hunter/fall.png",
            noFrames: 3
        },
        dead: {
            imageSrc: "./img/hunter/dead.png",
            noFrames: 11
        },
        attacked: {
            imageSrc: "./img/hunter/attacked.png", //placeholder
            noFrames: 3
        }
    },
    attackRange: {
        offset: {
            x: -200,
            y: 70
        },
        width: 170,
        height: 50
    }
});

player2.draw();

decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    rain.update();
    rain_right.update();
    player.update();
    player2.update();

    player.velocity.x = 0;
    player2.velocity.x = 0;

    //player 1
    if (keys.a.pressed && player.prevKey === "a") {
        player.velocity.x = -5;
        player.switchImage("run_left");
    } else if (keys.d.pressed && player.prevKey === "d") {
        player.velocity.x = 5;
        player.switchImage("run");
    } else {
        player.switchImage("idle");
    }
    if (player.velocity.y < 0) {
        player.switchImage("jump");
    } else if (player.velocity.y > 0) {
        player.switchImage("fall");
    }

    //player 2
    if (keys.ArrowRight.pressed && player2.prevKey === "ArrowRight") { //fix this
        player2.velocity.x = 5;
        player2.switchImage("run_right");
        console.log("walking right");
    } else if (keys.ArrowLeft.pressed && player2.prevKey === "ArrowLeft") {
        player2.velocity.x = -5;
        player2.switchImage("run");
    } else {
        player2.switchImage("idle");
    }

    if (player2.velocity.y < 0) {
        player2.switchImage("jump");
    } else if (player2.velocity.y > 0) {
        player2.switchImage("fall");
    }

    //player2 gets attacked
    if (detectAttack({
            attacker: player,
            receiver: player2
        }) &&
        player.attacking && player.currFrame === 2) {
        player2.getHit();
        player.attacking = false;

        document.querySelector("#rightHealth").style.width = player2.health + "%";
    }
    if (player.attacking && player.currFrame === 2) {
        player.attacking = false;
    }

    //player1 gets attacked
    if (detectAttack({
            attacker: player2,
            receiver: player
        }) && player2.attacking && player2.currFrame === 3) {
        player.getHit();
        player2.attacking = false;

        //player.health -= 10;
        document.querySelector("#leftHealth").style.width = player.health + "%";
    }
    if (player2.attacking && player2.currFrame === 3) {
        player2.attacking = false;
    }

    if (player.health <= 0 || player2.health <= 0) {
        printGameResult({
            player,
            enemy: player2,
            timerId
        });
    }
}

animate();

window.addEventListener("keydown", (event) => {
    if (!player.dead) {
        switch (event.key) {
            case "d":
                keys.d.pressed = true;
                player.prevKey = "d";
                break;
            case "a":
                keys.a.pressed = true;
                player.prevKey = "a";
                break;
            case "w":
                player.velocity.y = -20;
                break;
            case " ":
                player.attack();
                break;
        }

        if (!player2.dead) {
            switch (event.key) {
                //right character
                case "ArrowLeft":
                    keys.ArrowLeft.pressed = true;
                    player2.prevKey = "ArrowLeft";
                    break;
                case "ArrowRight":
                    keys.ArrowRight.pressed = true;
                    player2.prevKey = "ArrowRight";
                    break;
                case "ArrowUp":
                    player2.velocity.y = -20;
                    break;
                case "ArrowDown":
                    player2.attack();
                    break;
            }
        }
    }
})

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "d":
            keys.d.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            break;

        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break;
        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break;
    }
})
