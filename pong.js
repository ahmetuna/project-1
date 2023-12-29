//board
let board;
let boardWidth = 500;
let boardHeight = 500;
let context; 

//players
let playerWidth = 10;
let playerHeight = 100;
let playerVelocityY = 0;

let player1 = {
    x : 10,
    y : boardHeight/2,
    width: playerWidth,
    height: playerHeight,
    velocityY : 0
}

let player2 = {
    x : boardWidth - playerWidth - 10,
    y : boardHeight/2,
    width: playerWidth,
    height: playerHeight,
    velocityY : 0
}

//ball
let ballWidth = 10;
let ballHeight = 10;
let ball = {
    x : boardWidth/2,
    y : boardHeight/2,
    width: ballWidth,
    height: ballHeight,
    velocityX : 1,
    velocityY : 2
}

let player1Score = 0;
let player2Score = 0;

window.onload = function() {
    // Sayfa yüklendiğinde çalışacak olan fonksiyon

    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); // Tahtada çizim yapmak için kullanılır

    // İlk oyuncuyu çiz
    context.fillStyle="skyblue";
    context.fillRect(player1.x, player1.y, playerWidth, playerHeight);

    // Oyunu güncellemek için animasyon çerçevesini iste
    requestAnimationFrame(update);

    // Klavye tuşuna basıldığında oyuncuyu hareket ettir
    document.addEventListener("keyup", movePlayer);
}

function update() {
    // Oyun durumunu güncelle

    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    // Oyuncu 1
    context.fillStyle = "skyblue";
    let nextPlayer1Y = player1.y + player1.velocityY;
    if (!outOfBounds(nextPlayer1Y)) {
        player1.y = nextPlayer1Y;
    }
    context.fillRect(player1.x, player1.y, playerWidth, playerHeight);

    // Oyuncu 2
    let nextPlayer2Y = player2.y + player2.velocityY;
    if (!outOfBounds(nextPlayer2Y)) {
        player2.y = nextPlayer2Y;
    }
    context.fillRect(player2.x, player2.y, playerWidth, playerHeight);

    // Top
    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ballWidth, ballHeight);

    // Top tahtanın üstüne veya altına çarparsa
    if (ball.y <= 0 || (ball.y + ballHeight >= boardHeight)) { 
        ball.velocityY *= -1; // Yönü tersine çevir
    }

    // Top tahtaya çarparsa
    if (detectCollision(ball, player1)) {
        if (ball.x <= player1.x + player1.width) {
            ball.velocityX *= -1;   // Yönü tersine çevir
        }
    }
    else if (detectCollision(ball, player2)) {
        if (ball.x + ballWidth >= player2.x) {
            ball.velocityX *= -1;   // Yönü tersine çevir
        }
    }

    // Oyun bitimi kontrolü
    if (ball.x < 0) {
        player2Score++;
        resetGame(1);
    }
    else if (ball.x + ballWidth > boardWidth) {
        player1Score++;
        resetGame(-1);
    }

    // Skorları ekrana yazdır
    context.font = "45px sans-serif";
    context.fillText(player1Score, boardWidth/5, 45);
    context.fillText(player2Score, boardWidth*4/5 - 45, 45);

    // Orta çizgiyi çiz
    for (let i = 10; i < board.height; i += 25) {
        context.fillRect(board.width / 2 - 10, i, 5, 5);
    }
}

function outOfBounds(yPosition) {
    return (yPosition < 0 || yPosition + playerHeight > boardHeight);
}

// Klavye tuşuna basıldığında oyuncuyu hareket ettir
document.addEventListener("keydown", startMovePlayer);
document.addEventListener("keyup", stopMovePlayer);

function startMovePlayer(e) {
    // Oyuncu 1
    if (e.code == "KeyW") {
        player1.velocityY = -5;
    } else if (e.code == "KeyS") {
        player1.velocityY = 5;
    }

    // Oyuncu 2
    if (e.code == "ArrowUp") {
        player2.velocityY = -5;
    } else if (e.code == "ArrowDown") {
        player2.velocityY = 5;
    }
}

function stopMovePlayer(e) {
    // Oyuncu 1
    if (e.code == "KeyW" || e.code == "KeyS") {
        player1.velocityY = 0;
    }

    // Oyuncu 2
    if (e.code == "ArrowUp" || e.code == "ArrowDown") {
        player2.velocityY = 0;
    }
}

function detectCollision(a, b) {
    // Çarpışma tespiti
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function resetGame(direction) {
    // Oyunu sıfırla

    ball = {
        x : boardWidth/2,
        y : boardHeight/2,
        width: ballWidth,
        height: ballHeight,
        velocityX : direction,
        velocityY : 2
    }
}
