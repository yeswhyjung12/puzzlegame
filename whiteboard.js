const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let painting = false;

function startPosition(e) {
    painting = true;
    draw(e);
}

function endPosition() {
    painting = false;
    ctx.beginPath();
}

function draw(e) {
    if (!painting) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black'; /* 칠판 글씨 색상 */

    let clientX, clientY;
    if (e.touches) {
        const touch = e.touches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

// Touch events for mobile
canvas.addEventListener('touchstart', (e) => {
    if (e.cancelable) e.preventDefault();
    startPosition(e.touches[0]);
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    if (e.cancelable) e.preventDefault();
    endPosition(e);
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
    if (e.cancelable) e.preventDefault();
    draw(e.touches[0]);
}, { passive: false });

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
