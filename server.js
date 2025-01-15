const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public')); // Servir arquivos estáticos (frontend)

// Variável para armazenar a posição atual da bola
let ballPosition = { x: 200, y: 200 };

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Enviar a posição atual da bola para o novo usuário
  socket.emit('update-position', ballPosition);

  socket.on('joystick-input', (data) => {
    // Atualizar a posição da bola
    ballPosition = data;
    io.emit('update-position', data); // Reencaminhar para todos os dispositivos
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
