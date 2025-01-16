const socket = io();

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let users;

//função para desenhar todos os círculos
function drawBalls() {
    console.log(users); //debug

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas uma vez antes de desenhar todas os círculos
    //desenha todos os círculos
    users.forEach((value) => {
        ctx.beginPath();
        ctx.arc(value.x, value.y, 25, 0, Math.PI * 2);
        ctx.fillStyle = value.color;
        ctx.fill();
        ctx.closePath();
    });
}

//EVENTOS DE CLICK JOYSTICK
document.getElementById('left').addEventListener('click', () => {
    users.get(socket.id).x -= 10;
    users.get(socket.id).x = users.get(socket.id).x < 0 ? 0 : users.get(socket.id).x;

    socket.emit('joystick-input', { id: socket.id, x: users.get(socket.id).x, y: users.get(socket.id).y });
    drawBalls();
});

document.getElementById('up').addEventListener('click', () => {
    users.get(socket.id).y -= 10;
    users.get(socket.id).y = users.get(socket.id).y < 0 ? 0 : users.get(socket.id).y;

    socket.emit('joystick-input', { id: socket.id, x: users.get(socket.id).x, y: users.get(socket.id).y });
    drawBalls();
});

document.getElementById('down').addEventListener('click', () => {
    users.get(socket.id).y += 10;
    users.get(socket.id).y = users.get(socket.id).y > 400 ? 400 : users.get(socket.id).y;

    socket.emit('joystick-input', { id: socket.id, x: users.get(socket.id).x, y: users.get(socket.id).y });
    drawBalls();
});

document.getElementById('right').addEventListener('click', () => {
    users.get(socket.id).x += 10;
    users.get(socket.id).x = users.get(socket.id).x > 400 ? 400 : users.get(socket.id).x;

    socket.emit('joystick-input', { id: socket.id, x: users.get(socket.id).x, y: users.get(socket.id).y });
    drawBalls();
});

//EVENTOS DE CLICK DO MOUSE/TOUCH
canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    users.get(socket.id).x = x;
    users.get(socket.id).y = y;

    socket.emit('joystick-input', { id: socket.id, x: users.get(socket.id).x, y: users.get(socket.id).y });
    drawBalls();
});


socket.on('update-position', (data) => {
    users = new Map(data);
    drawBalls();
});
