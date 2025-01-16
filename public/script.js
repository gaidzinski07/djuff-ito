const socket = io();

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let users;
let nearUsers = [];
let talkingTo = undefined;

// Função para desenhar todos os círculos
function drawBalls() {
    console.log(users); //debug

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas uma vez antes de desenhar todas os círculos
    // Desenha todos os círculos
    users.forEach((value) => {
        ctx.beginPath();
        ctx.arc(value.x + 5, value.y + 5, 25, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(value.x, value.y, 25, 0, Math.PI * 2);
        ctx.fillStyle = value.color;
        ctx.fill();
        ctx.closePath();
    });

}

// Função para procurar os usuários próximos
function searchProximity(){
    foundTalk = false;
    
    nearUsers = [];
    // Itera por todos os usuários e verifica a distância
    users.forEach((value) => {
        if(value.id != socket.id){
            xdiff = value.x - users.get(socket.id).x
            ydiff = value.y - users.get(socket.id).y
            if( (xdiff < 50 && xdiff > -50) && (ydiff < 50 && ydiff > -50)) nearUsers.push(value); // add se perto
        }
    });

    const buttonContainer = document.getElementById('nearUsers');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.innerHTML = '';
    
    // Cria um botão para iniciar conversa com todos os usuários próximos
    nearUsers.forEach((user) => {
        if(user.id == talkingTo) foundTalk = true;
        const button = document.createElement('button');
        button.style.backgroundColor = user.color;
        button.innerText = "Conversar";
        button.addEventListener('click', () => {
            if(talkingTo == undefined) socket.emit('start-conversation', { starter: socket.id, receiver:  user.id }); // iniciar conversa
        });


        buttonContainer.appendChild(button);
    });

    // Termina a conversa se o usuário sair de proximidade
    if(talkingTo != undefined && !foundTalk){
        console.log(talkingTo);
        socket.emit('end-conversation', { starter: socket.id, receiver:  talkingTo });
    }
}

// Função para desenhar os círculos e procurar usuários próximos
function updateState(){
    drawBalls();
    searchProximity();
}

//EVENTOS DE CLICK JOYSTICK
document.getElementById('left').addEventListener('click', () => {
    users.get(socket.id).x -= 10;
    users.get(socket.id).x = users.get(socket.id).x < 0 ? 0 : users.get(socket.id).x;

    socket.emit('joystick-input', { id: socket.id, x: users.get(socket.id).x, y: users.get(socket.id).y });
    updateState();
});

document.getElementById('up').addEventListener('click', () => {
    users.get(socket.id).y -= 10;
    users.get(socket.id).y = users.get(socket.id).y < 0 ? 0 : users.get(socket.id).y;

    socket.emit('joystick-input', { id: socket.id, x: users.get(socket.id).x, y: users.get(socket.id).y });
    updateState();
});

document.getElementById('down').addEventListener('click', () => {
    users.get(socket.id).y += 10;
    users.get(socket.id).y = users.get(socket.id).y > 400 ? 400 : users.get(socket.id).y;

    socket.emit('joystick-input', { id: socket.id, x: users.get(socket.id).x, y: users.get(socket.id).y });
    updateState();
});

document.getElementById('right').addEventListener('click', () => {
    users.get(socket.id).x += 10;
    users.get(socket.id).x = users.get(socket.id).x > 400 ? 400 : users.get(socket.id).x;

    socket.emit('joystick-input', { id: socket.id, x: users.get(socket.id).x, y: users.get(socket.id).y });
    updateState();
});

//EVENTOS DE CLICK DO MOUSE/TOUCH
canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    users.get(socket.id).x = x;
    users.get(socket.id).y = y;

    socket.emit('joystick-input', { id: socket.id, x: users.get(socket.id).x, y: users.get(socket.id).y });
    updateState();
});

// Evento para atualizar as posições dos círculos no cliente
socket.on('update-position', (data) => {
    users = new Map(data);
    updateState();
});

//CONVERSA

// Evento para iniciar conversa caso o cliente esteja envolvido
socket.on('conversation-started', (data) => {
    if(data.receiver == socket.id || data.starter == socket.id){
        if(data.starter == socket.id) talkingTo = data.receiver;
        if(data.receiver == socket.id) talkingTo = data.starter;
        
        // Div para o chat
        const chatDiv = document.getElementById('chat');
        chatDiv.style.display = 'block';
        
        // Div para as mensagens
        const messagesDiv = document.createElement('div');
        messagesDiv.id = 'messages';
        messagesDiv.style.height = '200px';
        messagesDiv.style.overflowY = 'scroll';
        messagesDiv.style.width = '30%';
        messagesDiv.style.backgroundColor = 'white';
        messagesDiv.style.margin = '0 auto';
        chatDiv.appendChild(messagesDiv);

        const inputs = document.createElement('div');
        inputs.style.display = 'flex';
        inputs.style.justifyContent = 'center';
        chatDiv.appendChild(inputs);

        // Elemento para input
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'messageInput';
        inputs.appendChild(input);
        

        // Botão para enviar
        const sendButton = document.createElement('button');
        sendButton.innerText = 'Enviar';
        sendButton.addEventListener('click', () => {
            const message = input.value;
            socket.emit('send-message', { sender: socket.id, receiver: talkingTo, message: message });
            input.value = '';
        });
        inputs.appendChild(sendButton);
    }
  });

  // Evento para notificar o término da conversa atual
  socket.on('conversation-ended', (data) => {
        if(data.receiver == socket.id || data.starter == socket.id){
        talkingTo = undefined;

        const chatDiv = document.getElementById('chat');
        chatDiv.innerHTML = '';
        chatDiv.style.display = 'none';
    }
  })

  // Evento para notificar uma mensagem enviada do cliente para um usuário
  socket.on('message-sent', (data) => {
    if(data.to == socket.id || data.from == socket.id){
        const messagesDiv = document.getElementById('messages');
        const messageElement = document.createElement('div');
        messageElement.innerText = `${data.message}`;
        messageElement.style.color = users.get(data.from).color;
        messagesDiv.appendChild(messageElement);
    }
  })
