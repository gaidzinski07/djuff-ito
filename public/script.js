const socket = io();

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const ball = { x: 200, y: 200, size: 20 };

function drawBall() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
}

document.getElementById('left').addEventListener('click', () => {
    socket.emit('joystick-input', { dx: -10, dy: 0 });
});

document.getElementById('up').addEventListener('click', () => {
    socket.emit('joystick-input', { dx: 0, dy: -10 });
});

document.getElementById('down').addEventListener('click', () => {
    socket.emit('joystick-input', { dx: 0, dy: 10 });
});

document.getElementById('right').addEventListener('click', () => {
    socket.emit('joystick-input', { dx: 10, dy: 0 });
});

socket.on('update-position', (data) => {
    ball.x += data.dx;
    ball.y += data.dy;
    drawBall();
});

drawBall();
