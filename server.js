const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public')); // Servir arquivos estáticos (frontend)

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joystick-input', (data) => {
    io.emit('update-position', data); // Reencaminhar para todos os dispositivos
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
