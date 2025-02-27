const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20); // Aumenta o contexto do canvas

let board = Array.from({length: 20}, () => Array(10).fill(0)); // Cria o tabuleiro

const pieces = [
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1], [1, 1]], // O
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]], // Z
    [[1, 1, 1, 1]], // I
    [[1, 1, 1], [1, 0, 0]] // L
];

let currentPiece;
let position;

function drawBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value > 0) {
                context.fillStyle = 'white';
                context.fillRect(x, y, 1, 1);
            }
        });
    });
}

function spawnPiece() {
    const randomIndex = Math.floor(Math.random() * pieces.length);
    currentPiece = pieces[randomIndex];
    position = { x: 4, y: 0 };
}

function drawPiece() {
    currentPiece.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value > 0) {
                context.fillStyle = 'white';
                context.fillRect(position.x + x, position.y + y, 1, 1);
            }
        });
    });
}

function collision() {
    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x] && (board[y + position.y] && board[y + position.y][x + position.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function merge() {
    currentPiece.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value > 0) {
                board[y + position.y][x + position.x] = value;
            }
        });
    });
}

function rotate() {
    const tempPiece = currentPiece[0].map((_, index) => currentPiece.map(row => row[index]).reverse());
    currentPiece = tempPiece;

    if (collision()) {
        currentPiece = tempPiece.map(row => row.reverse());
    }
}

function lockPiece() {
    merge();
    position.y = 0;
    position.x = 4;
    if (collision()) {
        alert('Game Over!');
        board = Array.from({length: 20}, () => Array(10).fill(0)); // Reinicia o tabuleiro
    }
}

function moveDown() {
    position.y++;
    if (collision()) {
        position.y--;
        lockPiece();
        spawnPiece();
    }
}

function moveLeft() {
    position.x--;
    if (collision()) {
        position.x++;
    }
}

function moveRight() {
    position.x++;
    if (collision()) {
        position.x--;
    }
}

function update() {
    drawBoard();
    drawPiece();
    moveDown();
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') moveLeft();
    if (event.key === 'ArrowRight') moveRight();
    if (event.key === 'ArrowDown') moveDown();
    if (event.key === 'ArrowUp') rotate();
});

spawnPiece();
setInterval(update, 1000);
