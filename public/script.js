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
    ball.x -= 10;
    socket.emit('joystick-input', { x: ball.x, y: ball.y });
    drawBall();
});

document.getElementById('up').addEventListener('click', () => {
    ball.y -= 10;
    socket.emit('joystick-input', { x: ball.x, y: ball.y });
    drawBall();
});

document.getElementById('down').addEventListener('click', () => {
    ball.y += 10;
    socket.emit('joystick-input', { x: ball.x, y: ball.y });
    drawBall();
});

document.getElementById('right').addEventListener('click', () => {
    ball.x += 10;
    socket.emit('joystick-input', { x: ball.x, y: ball.y });
    drawBall();
});

canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    ball.x = x;
    ball.y = y;
    socket.emit('joystick-input', { x: ball.x, y: ball.y });
    drawBall();
});


socket.on('update-position', (data) => {
    ball.x = data.x;
    ball.y = data.y;
    drawBall();
});



drawBall();
