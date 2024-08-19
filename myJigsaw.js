let CANVAS = null;
let CONTEXT = null;
// let SCALER = 0.6; // 스크린 크기 조절
let SCALER;
if (platform.os.family === 'Android' || platform.os.family === 'iOS') {
    // 모바일 디바이스인 경우
    SCALER = 0.86;
} else {
    // PC인 경우
    SCALER = 0.6;
}
let SIZE = { x: 0, y: 0, width: 0, height: 0, rows: 3, columns: 3 };
let PIECES = [];
let SELECTED_PIECE = null;
let START_TIME = null;
let END_TIME = null;

let SOUND = new Audio("music/bubblepop.mp3");
SOUND.volume = 0.3;

let END_SOUND = new Audio("music/bubbling.mp3");
END_SOUND.volume = 0.5;

let AUDIO_CONTEXT = new (AudioContext || window.AudioContext)();

window.onload = main;

function main() {
    CANVAS = document.getElementById("myCanvas");
    CONTEXT = CANVAS.getContext("2d");
    addEventListener();
}

//////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', (event) => {
    const dropZone = document.getElementById('dropZone');
    const imageInput = document.getElementById('imageInput');
    const startButton = document.getElementById('startButton');

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImage({ target: { files: files } });
        }
    });

    dropZone.addEventListener('click', () => {
        imageInput.click();
    });

    imageInput.addEventListener('change', handleImage);

    function handleImage(event) {
        const file = event.target.files[0];
        if (file) {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = function (e) {
                img.src = e.target.result;
            };

            img.onload = function () {
                IMAGE = img; // This assumes IMAGE is a global variable you use elsewhere
                handleResize();
                initializePices(SIZE.rows, SIZE.columns);
                updateGame();
                startButton.disabled = false; // Enable the start button
            };
            reader.readAsDataURL(file);
        }
    }
});

function setDifficulty() {
    let diff = document.getElementById("Difficulty").value;
    switch (diff) {
        case "easy":
            initializePices(3, 3);
            break;
        case "medium":
            initializePices(5, 5);
            break;
        case "hard":
            initializePices(8, 8);
            break;
        case "challange":
            initializePices(14, 14);
            break;
    }
}

function restart() {
    START_TIME = new Date().getTime();
    END_TIME = null;
    randomizePices();
    document.getElementById("menuItems").style.display = "none";
    document.getElementById("langs").style.display = "none";
    document.getElementById("overlay").style.display = "none"; // 오버레이를 숨김
}

function updateTime() {
    let now = new Date().getTime();
    if (START_TIME != null) {
        if (END_TIME != null) {
            document.getElementById("time").innerHTML = formatTime(END_TIME - START_TIME);
            document.getElementById("overlay-time").innerHTML = formatTime(END_TIME - START_TIME);
        } else {
            document.getElementById("time").innerHTML = formatTime(now - START_TIME);
            document.getElementById("overlay-time").innerHTML = formatTime(now - START_TIME);
        }
    }
}

function isComplete() {
    for (let i = 0; i < PIECES.length; i++) {
        if (PIECES[i].correct == false) {
            return false;
        }
    }
    return true;
}

function formatTime(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let s = Math.floor(seconds % 60);
    let m = Math.floor((seconds % (60 * 60)) / 60);
    let h = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));

    let formattedTime = h.toString().padStart(2, '0');
    formattedTime += " : ";
    formattedTime += m.toString().padStart(2, '0');
    formattedTime += " : ";
    formattedTime += s.toString().padStart(2, '0');

    return formattedTime;
}

function addEventListener() {
    CANVAS.addEventListener("mousedown", onMouseDown);
    CANVAS.addEventListener("mousemove", onMouseMove);
    CANVAS.addEventListener("mouseup", onMouseUp);
    CANVAS.addEventListener("touchstart", onTouchStart, { passive: true });
    CANVAS.addEventListener("touchmove", onTouchMove, { passive: true });
    //CANVAS.addEventListener("touchstart", onTouchStart,);
    //CANVAS.addEventListener("touchmove", onTouchMove,);
    CANVAS.addEventListener("touchend", onTouchEnd);
}

function onTouchStart(evt) {
    let loc = {
        x: evt.touches[0].clientX,
        y: evt.touches[0].clientY
    };
    onMouseDown(loc);
}
function onTouchMove(evt) {
    let loc = {
        x: evt.touches[0].clientX,
        y: evt.touches[0].clientY
    };
    onMouseMove(loc);
}
function onTouchEnd() {
    onMouseUp();
}

function onMouseDown(evt) {
    SELECTED_PIECE = getPressePiece(evt);
    if (SELECTED_PIECE != null) {
        const index = PIECES.indexOf(SELECTED_PIECE);
        if (index > -1) {
            PIECES.splice(index, 1);
            PIECES.push(SELECTED_PIECE);
        }
        SELECTED_PIECE.offset = {
            x: evt.x - SELECTED_PIECE.x,
            y: evt.y - SELECTED_PIECE.y
        }
        SELECTED_PIECE.correct = false;
    }
}

function onMouseMove(evt) {
    if (SELECTED_PIECE != null) {
        SELECTED_PIECE.x = evt.x - SELECTED_PIECE.offset.x;
        SELECTED_PIECE.y = evt.y - SELECTED_PIECE.offset.y;
    }
}

function onMouseUp() {
    if (SELECTED_PIECE && SELECTED_PIECE.isClose()) {
        SELECTED_PIECE.snap();
        if (isComplete() && END_TIME == null) {
            let now = new Date().getTime();
            END_TIME = now;
            setTimeout(playMelody, 300);
            setTimeout(() => {
                document.getElementById("overlay").style.display = "flex"; // 오버레이를 표시
            }, 900); // 0.9초 지연
        }
    }
    SELECTED_PIECE = null;
}

function getPressePiece(loc) {
    for (let i = PIECES.length - 1; i >= 0; i--) {
        if (loc.x > PIECES[i].x && loc.x < PIECES[i].x + PIECES[i].width &&
            loc.y > PIECES[i].y && loc.y < PIECES[i].y + PIECES[i].height) {
            return PIECES[i];
        }
    }
    return null;
}

function handleResize() {
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;

    let resizer = SCALER *
        Math.min(
            window.innerWidth / IMAGE.width,
            window.innerHeight / IMAGE.height
        );
    SIZE.width = resizer * IMAGE.width;
    SIZE.height = resizer * IMAGE.height
    SIZE.x = window.innerWidth / 2 - SIZE.width / 2;
    SIZE.y = window.innerHeight / 2 - SIZE.height / 2;
}

function updateGame() {
    CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);

    // 배경색 설정
    CONTEXT.fillStyle = "white";
    CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height);

    // 이미지 주변 색상 추가
    const BORDER_SIZE = 16; // 테두리 크기
    const BORDER_COLOR = "lightblue"; // 테두리 색상
    // 테두리 영역 그리기
    CONTEXT.fillStyle = BORDER_COLOR;
    // 위쪽 테두리
    CONTEXT.fillRect(SIZE.x - BORDER_SIZE, SIZE.y - BORDER_SIZE, SIZE.width + 2 * BORDER_SIZE, BORDER_SIZE);
    // 아래쪽 테두리
    CONTEXT.fillRect(SIZE.x - BORDER_SIZE, SIZE.y + SIZE.height, SIZE.width + 2 * BORDER_SIZE, BORDER_SIZE);
    // 왼쪽 테두리
    CONTEXT.fillRect(SIZE.x - BORDER_SIZE, SIZE.y, BORDER_SIZE, SIZE.height);
    // 오른쪽 테두리
    CONTEXT.fillRect(SIZE.x + SIZE.width, SIZE.y, BORDER_SIZE, SIZE.height);

    // 이미지 테두리 그리기
    CONTEXT.strokeStyle = "black";
    CONTEXT.strokeRect(SIZE.x, SIZE.y, SIZE.width, SIZE.height);

    // 이미지 그리기
    CONTEXT.globalAlpha = 0.4;
    CONTEXT.drawImage(IMAGE,
        SIZE.x, SIZE.y,
        SIZE.width, SIZE.height);
    CONTEXT.globalAlpha = 1;

    for (let i = 0; i < PIECES.length; i++) {
        PIECES[i].draw(CONTEXT);
    }

    updateTime();
    window.requestAnimationFrame(updateGame);
}

function initializePices(rows, cols) {
    SIZE.rows = rows;
    SIZE.columns = cols;

    PIECES = [];
    for (let i = 0; i < SIZE.rows; i++) {
        for (let j = 0; j < SIZE.columns; j++) {
            PIECES.push(new Piece(i, j));
        }
    }

    let cnt = 0;
    for (let i = 0; i < SIZE.rows; i++) {
        for (let j = 0; j < SIZE.columns; j++) {
            const piece = PIECES[cnt];
            if (i == SIZE.rows - 1) {
                piece.bottom = null;
            } else {
                const sgn = (Math.random() - 0.5) < 0 ? -1 : 1;
                piece.bottom = sgn * (Math.random() * 0.4 + 0.3);
            }

            if (j == SIZE.columns - 1) {
                piece.right = null;
            } else {
                const sgn = (Math.random() - 0.5) < 0 ? -1 : 1;
                piece.right = sgn * (Math.random() * 0.4 + 0.3);
            }

            if (j == 0) {
                piece.left = null;
            } else {
                piece.left = -PIECES[cnt - 1].right;
            }

            if (i == 0) {
                piece.top = null;
            } else {
                piece.top = -PIECES[cnt - SIZE.columns].bottom;
            }
            cnt++;
        }
    }
}

function randomizePices() {
    for (let i = 0; i < PIECES.length; i++) {
        let loc = {
            x: Math.random() * (CANVAS.width - PIECES[i].width),
            y: Math.random() * (CANVAS.height - PIECES[i].height)
        }
        PIECES[i].x = loc.x;
        PIECES[i].y = loc.y;
        PIECES[i].correct = false;
    }
}

class Piece {
    constructor(rowIndex, colIndex) {
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
        this.x = SIZE.x + SIZE.width * this.colIndex / SIZE.columns;
        this.y = SIZE.y + SIZE.height * this.rowIndex / SIZE.rows;
        this.width = SIZE.width / SIZE.columns;
        this.height = SIZE.height / SIZE.rows;
        this.xCorrect = this.x;
        this.yCorrect = this.y;
        this.correct = true;
    }
    draw(context) {
        context.beginPath();



        const sz = Math.min(this.width, this.height);
        const neck = 0.1 * sz;
        const tabWidth = 0.2 * sz;
        const tabHeight = 0.2 * sz;

        //context.rect(this.x, this.y, this.width, this.height);
        context.moveTo(this.x, this.y);

        //to top right
        if (this.top) {
            context.lineTo(this.x + this.width * Math.abs(this.top) - neck,
                this.y);
            context.bezierCurveTo(
                this.x + this.width * Math.abs(this.top) - neck,
                this.y - tabHeight * Math.sign(this.top) * 0.2,

                this.x + this.width * Math.abs(this.top) - tabWidth,
                this.y - tabHeight * Math.sign(this.top),

                this.x + this.width * Math.abs(this.top),
                this.y - tabHeight * Math.sign(this.top)
            );
            context.bezierCurveTo(
                this.x + this.width * Math.abs(this.top) + tabWidth,
                this.y - tabHeight * Math.sign(this.top),

                this.x + this.width * Math.abs(this.top) + neck,
                this.y - tabHeight * Math.sign(this.top) * 0.2,

                this.x + this.width * Math.abs(this.top) + neck,
                this.y
            );
        }
        context.lineTo(this.x + this.width, this.y);

        //to bottom right
        if (this.right) {
            context.lineTo(this.x + this.width, this.y + this.height * Math.
                abs(this.right) - neck);
            context.bezierCurveTo(
                this.x + this.width - tabHeight * Math.sign(this.right) *
                0.2,
                this.y + this.height * Math.abs(this.right) - neck,

                this.x + this.width - tabHeight * Math.sign(this.right),
                this.y + this.height * Math.abs(this.right) - tabWidth,

                this.x + this.width - tabHeight * Math.sign(this.right),
                this.y + this.height * Math.abs(this.right)
            );
            context.bezierCurveTo(
                this.x + this.width - tabHeight * Math.sign(this.right),
                this.y + this.height * Math.abs(this.right) + tabWidth,

                this.x + this.width - tabHeight * Math.sign(this.right) *
                0.2,
                this.y + this.height * Math.abs(this.right) + neck,

                this.x + this.width,
                this.y + this.height * Math.abs(this.right) + neck
            );
        }
        context.lineTo(this.x + this.width, this.y + this.height);

        //to bottom left
        if (this.bottom) {
            context.lineTo(this.x + this.width * Math.abs(this.bottom)
                + neck,
                this.y + this.height);

            context.bezierCurveTo(
                this.x + this.width * Math.abs(this.bottom) + neck,
                this.y + this.height + tabHeight * Math.sign(this.bottom
                ) * 0.2,

                this.x + this.width * Math.abs(this.bottom) + tabWidth,
                this.y + this.height + tabHeight * Math.sign(this.bottom),

                this.x + this.width * Math.abs(this.bottom),
                this.y + this.height + tabHeight * Math.sign(this.bottom)
            );

            context.bezierCurveTo(
                this.x + this.width * Math.abs(this.bottom) - tabWidth,
                this.y + this.height + tabHeight * Math.sign(this.bottom),

                this.x + this.width * Math.abs(this.bottom) - neck,
                this.y + this.height + tabHeight * Math.sign(this.bottom
                ) * 0.2,

                this.x + this.width * Math.abs(this.bottom) - neck,
                this.y + this.height
            );
        }
        context.lineTo(this.x, this.y + this.height);

        //to top left
        if (this.left) {
            context.lineTo(this.x, this.y + this.height * Math.abs(this.
                left) + neck);

            context.bezierCurveTo(
                this.x + tabHeight * Math.sign(this.left) * 0.2,
                this.y + this.height * Math.abs(this.left) + neck,

                this.x + tabHeight * Math.sign(this.left),
                this.y + this.height * Math.abs(this.left) + tabWidth,

                this.x + tabHeight * Math.sign(this.left),
                this.y + this.height * Math.abs(this.left)
            );

            context.bezierCurveTo(
                this.x + tabHeight * Math.sign(this.left),
                this.y + this.height * Math.abs(this.left) - tabWidth,

                this.x + tabHeight * Math.sign(this.left) * 0.2,
                this.y + this.height * Math.abs(this.left) - neck,

                this.x,
                this.y + this.height * Math.abs(this.left) - neck
            );
        }
        context.lineTo(this.x, this.y);

        context.save();
        context.clip();

        const scaledTabHeight =
            Math.min(IMAGE.width / SIZE.columns,
                IMAGE.height / SIZE.rows) * tabHeight / sz;

        context.drawImage(IMAGE,
            this.colIndex * IMAGE.width / SIZE.columns
            - scaledTabHeight,
            this.rowIndex * IMAGE.height / SIZE.rows
            - scaledTabHeight,
            IMAGE.width / SIZE.columns
            + scaledTabHeight * 2,
            IMAGE.height / SIZE.rows
            + scaledTabHeight * 2,
            this.x - tabHeight,
            this.y - tabHeight,
            this.width + tabHeight * 2,
            this.height + tabHeight * 2);

        context.restore();
        context.stroke();
    }
    isClose() {
        if (distance({ x: this.x, y: this.y },
            { x: this.xCorrect, y: this.yCorrect }) < this.width / 3) /**퍼즐 조각 수*/ {
            return true;
        }
        return false;
    }
    snap() {
        this.x = this.xCorrect;
        this.y = this.yCorrect;
        this.correct = true;
        SOUND.play();
    }
}

function distance(p1, p2) {
    return Math.sqrt(
        (p1.x - p2.x) * (p1.x - p2.x) +
        (p1.y - p2.y) * (p1.y - p2.y));
}

function playNote(key, duration) {
    let osc = AUDIO_CONTEXT.createOscillator();
    osc.frequency.value = key;
    osc.start(AUDIO_CONTEXT.currentTime);
    osc.stop(AUDIO_CONTEXT.currentTime + duration / 1000);

    let envelope = AUDIO_CONTEXT.createGain();
    osc.connect(envelope);
    envelope.connect(AUDIO_CONTEXT.destination);
    envelope.gain.setValueAtTime(0, AUDIO_CONTEXT.currentTime);
    envelope.gain.linearRampToValueAtTime(0.5, AUDIO_CONTEXT.currentTime
        + 0.1);
    envelope.gain.linearRampToValueAtTime(0, AUDIO_CONTEXT.currentTime
        + duration / 1000)

    setTimeout(function () {
        osc.disconnect();
    }, duration);
}

function resetGame() {
    restart();
}

function otherGame() {
    document.getElementById('mainPage').style.display = 'block';
    document.getElementById('applePage').style.display = 'none';
    document.getElementById('grapePage').style.display = 'none';
    document.getElementById('orangePage').style.display = 'none';
    document.getElementById('watermelonPage').style.display = 'none';
    document.getElementById('mangoPage').style.display = 'none';
    document.getElementById('tigerPage').style.display = 'none';
    document.getElementById('lionPage').style.display = 'none';
    document.getElementById('catPage').style.display = 'none';
    document.getElementById('dogPage').style.display = 'none';
    document.getElementById('dolpinPage').style.display = 'none';
    document.getElementById('ownPuzzle').style.display = 'none';
}

function playMelody() {
    END_SOUND.play();
}