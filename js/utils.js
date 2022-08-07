function detectAttack({
    attacker,
    receiver
}) {
    return (
        attacker.attackRange.position.x + attacker.attackRange.width >= receiver.position.x &&
        attacker.attackRange.position.x <= receiver.position.x + receiver.width &&
        attacker.attackRange.position.y + attacker.attackRange.height >= receiver.position.y &&
        attacker.attackRange.position.y <= receiver.position.y + receiver.height &&
        attacker.attacking
    )
}

function printGameResult({
    player,
    enemy: player2,
    timerId
}) {
    clearTimeout(timerId);
    if (player.health === player2.health) {
        document.querySelector("#gameResult").innerHTML = "TIE";
    } else if (player.health > player2.health) {
        document.querySelector("#gameResult").innerHTML = "PLAYER 1 WINS";
    } else {
        document.querySelector("#gameResult").innerHTML = "PLAYER 2 WINS";
    }
}

function decreaseTimer() {

    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector("#timer").innerHTML = timer;
    } else {
        printGameResult({
            player,
            enemy: player2,
            timerId
        });
    }
}