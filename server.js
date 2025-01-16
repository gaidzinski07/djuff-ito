const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public')); // Servir arquivos estáticos (frontend)

// Variável para armazenar os círculos de todos os usuários
const users = new Map();

io.on('connection', (socket) => {
  console.log('Um usuário conectou:', socket.id);

  // Adiciona um objeto para o usuário recém conectado com um círculo em (200,200) com uma cor aleatória
  users.set(socket.id, {id: socket.id, x: 200, y: 200, color:`rgb(${Math.random() * 200/2 + 50} , ${Math.random() * 255 + 25}, ${Math.random() * 155 + 10})`});

  // Enviar a posição atual dos círculos para o novo usuário
  socket.emit('update-position', Array.from(users.entries()));
  
  socket.on('joystick-input', (data) => {
    // Atualizar a posição do círculo de um usuário
    users.get(data.id).x = data.x;
    users.get(data.id).y = data.y;
    io.emit('update-position', Array.from(users.entries())); // Reencaminhar para todos os dispositivos
  });

  socket.on('disconnect', () => {
    console.log('Um usuário desconectou:', socket.id);
    // Deletar o usuário do map
    users.delete(socket.id);
    // Atualizar todos os usuários
    io.emit('update-position', Array.from(users.entries()));
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
