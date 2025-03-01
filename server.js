const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const readline = require('readline');

// Criando a aplicação Express
const app = express();

// Criando o servidor HTTP a partir do app Express
const server = http.createServer(app);

// Inicializando o Socket.IO com o servidor HTTP
const io = socketIo(server);

// Lista de clientes conectados
let clients = {};

// Interface interativa para o controlador via console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Servindo arquivos estáticos (caso você queira servir arquivos HTML, JS, etc.)
app.use(express.static('public'));

// Quando o servidor de socket recebe uma conexão de um cliente
io.on('connection', (socket) => {
  console.log(`Novo cliente conectado: ${socket.id}`);

  // Adicionando o cliente à lista de clientes
  clients[socket.id] = socket;

  // Ouvir eventos de mensagens do cliente
  socket.on('message', (msg) => {
    console.log(`Mensagem recebida do cliente ${socket.id}: ${msg}`);
    socket.emit('message', `Recebido: ${msg}`);
  });

  // Evento de desconexão
  socket.on('disconnect', () => {
    console.log(`Cliente ${socket.id} desconectado`);
    delete clients[socket.id];
  });
});

// Função para enviar mensagens personalizadas para um cliente específico
function sendMessageToClient(clientId, message) {
  if (clients[clientId]) {
    clients[clientId].emit('message', message);
    console.log(`Mensagem enviada para o cliente ${clientId}: ${message}`);
  } else {
    console.log(`Cliente com ID ${clientId} não encontrado.`);
  }
}

// Função para enviar uma mensagem para todos os clientes
function sendMessageToAll(message) {
  Object.values(clients).forEach((client) => {
    client.emit('message', message);
  });
  console.log(`Mensagem enviada para todos os clientes: ${message}`);
}

// Função que permite ao controlador enviar eventos via console
function startCommandInterface() {
  rl.question('[ENTER] para distribuir as cartas...', () => {
    const availableNumbers = Array.from({length:100}, (_, i) => i + 1);
    const selected = {};
    let i = 0;
    Object.keys(clients).forEach((socketId) => {
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        selected[i++] = availableNumbers.splice(randomIndex, 1)[0];
        sendMessageToClient(socketId, randomIndex);
    });
    startCommandInterface();  // Reinicia a interface para o próximo comando
  });
}

// Inicia a interface de comando do controlador
startCommandInterface();

// Definindo a porta em que o servidor irá escutar
const PORT = process.argv[2] || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
