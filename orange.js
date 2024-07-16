var rows = 3;
var columns = 3;

var currTile;
var otherTile;

var turns = 0;

var imgOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
var originalOrder = [...imgOrder]; // 원래 순서 저장

window.onload = function () {
    setupBoard();
}

function setupBoard() {
    imgOrder = [...originalOrder]; // imgOrder 배열을 초기 상태로 재설정
    shuffleArray(imgOrder); // 무작위 배열

    let board = document.getElementById("orangeBoard");
    if (board) {
        board.innerHTML = ""; // 기존 타일들을 제거
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                let tile = document.createElement("img");
                tile.id = r.toString() + "-" + c.toString();
                tile.src = "orangeImg/" + imgOrder.shift() + ".jpg";

                // Drag & Drop
                tile.addEventListener("dragstart", dragstart); // click an image to drag
                tile.addEventListener("dragover", dragover); // moving around while clicked
                tile.addEventListener("dragenter", dragenter); // dragging image onto another one
                tile.addEventListener("dragleave", dragleave); // drag image leaving another image
                tile.addEventListener("drop", dragdrop); // drag an image over another image, drop the image
                tile.addEventListener("dragend", dragend); // after drag and drop, swap the two tiles

                // Touch Events
                tile.addEventListener("touchstart", touchstart);
                tile.addEventListener("touchmove", touchmove);
                tile.addEventListener("touchend", touchend);

                board.appendChild(tile);
                
                turns = 0;
                document.getElementById("orangeTurns").innerText = turns;
                document.getElementById("overlay3-turns").innerText = turns;
                document.getElementById("overlay3").style.display = "none"; // 오버레이를 숨김

                console.log('Image added:', tile.src); // 디버그 메시지 추가
            }
        }
    } else {
        console.error('Element with id "orangeBoard" not found');
    }
}

console.log('orange.js script ended');

function resetGame() {
    setupBoard();
}

function otherGame() {
    document.getElementById('mainPage').style.display = 'block';
    document.getElementById('applePage').style.display = 'none';
    document.getElementById('grapePage').style.display = 'none';
    document.getElementById('orangePage').style.display = 'none';
    document.getElementById('watermelonPage').style.display = 'none';
}

function dragstart() {
    currTile = this; // this refers to the img tile being dragged
}

function dragover(e) {
    e.preventDefault();
}

function dragenter(e) {
    e.preventDefault();
}

function dragleave() { }

function dragdrop() {
    otherTile = this; // this refers to the img tile being dropped on
}

function dragend() {
    swapTiles();
}

function touchstart(e) {
    e.preventDefault();
    currTile = this;
    var touch = e.touches[0];
    currTile.initialX = touch.clientX;
    currTile.initialY = touch.clientY;
}

function touchmove(e) {
    e.preventDefault();
    var touch = e.touches[0];
    var deltaX = touch.clientX - currTile.initialX;
    var deltaY = touch.clientY - currTile.initialY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal movement
        if (deltaX > 0) {
            otherTile = getAdjacentTile(currTile, "right");
        } else {
            otherTile = getAdjacentTile(currTile, "left");
        }
    } else {
        // Vertical movement
        if (deltaY > 0) {
            otherTile = getAdjacentTile(currTile, "down");
        } else {
            otherTile = getAdjacentTile(currTile, "up");
        }
    }
}

function touchend(e) {
    swapTiles();
}



function swapTiles() {
    if (!otherTile) return;
    let currCoords = currTile.id.split("-");
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = r == r2 && c2 == c - 1;
    let moveRight = r == r2 && c2 == c + 1;
    let moveUp = c == c2 && r2 == r - 1;
    let moveDown = c == c2 && r2 == r + 1;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;

        currTile.src = otherImg;
        otherTile.src = currImg;

        turns += 1;
        document.getElementById("orangeTurns").innerText = turns;
        document.getElementById("overlay3-turns").innerText = turns;

        if (checkCompletion()) {
            disableTiles();
            setTimeout(() => {
                document.getElementById("overlay3").style.display = "flex"; // 오버레이를 표시
            }, 700); // 0.7초 지연
        }
    }
}

function getAdjacentTile(tile, direction) {
    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    switch (direction) {
        case "left":
            if (c > 0) return document.getElementById(r.toString() + "-" + (c - 1).toString());
            break;
        case "right":
            if (c < columns - 1) return document.getElementById(r.toString() + "-" + (c + 1).toString());
            break;
        case "up":
            if (r > 0) return document.getElementById((r - 1).toString() + "-" + c.toString());
            break;
        case "down":
            if (r < rows - 1) return document.getElementById((r + 1).toString() + "-" + c.toString());
            break;
    }
    return null;
}


function checkCompletion() {
    let currentOrder = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            currentOrder.push(tile.src.split('/').pop().split('.jpg')[0]);
        }
    }
    return currentOrder.every((val, index) => val === originalOrder[index]);
}

function disableTiles() {
    let tiles = document.querySelectorAll("#orangeBoard img");
    tiles.forEach(tile => {
        tile.style.pointerEvents = 'none'; // 타일 클릭 비활성화
    });
}

function shuffleArray(array) { // 무작위 배열 여기부터
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // 0부터 i 사이의 임의의 정수 j를 선택
        [array[i], array[j]] = [array[j], array[i]]; // array[i]와 array[j]의 위치를 교환
    }
} //여기까지