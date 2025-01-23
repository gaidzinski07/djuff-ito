# **Joystick WebSocket**

Este projeto demonstra a comunicação em tempo real entre dois dispositivos utilizando WebSockets. Um joystick em um celular controla a posição de uma bolinha 2D exibida em um navegador de computador.

---

## **Índice**
1. [Descrição do Projeto](#descrição-do-projeto)  
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)  
3. [Como Executar o Projeto](#como-executar-o-projeto)  
4. [Demonstração](#demonstração)
5. [Autoria](#autoria)

---

## **Descrição do Projeto**

O sistema conecta um celular e um computador via WebSockets:
- O celular envia os inputs do joystick (botões para cima, baixo, esquerda, direita) para um servidor Node.js.  
- O servidor retransmite esses inputs para o computador, que atualiza a posição de uma bolinha exibida em um canvas HTML.

---

## **Tecnologias Utilizadas**

- **Frontend:** HTML5, CSS, JavaScript  
- **Backend:** Node.js, Express.js, Socket.IO  
- **Protocolos:** WebSockets  

---

## **Como Executar o Projeto**

### **Pré-requisitos**
1. **Node.js** instalado. [Baixe aqui](https://nodejs.org/).  
2. Editor de código ou terminal para executar comandos (ex.: VS Code).  
3. Dois dispositivos conectados na mesma rede:  
   - Um celular para atuar como joystick.  
   - Um computador para exibir o movimento da bolinha.  

### **Passo a Passo**

#### **1. Clone o Repositório**
```bash
git clone https://github.com/seu-usuario/joystick-websocket.git
cd joystick-websocket
```

#### **2. Instale as Dependências**
```bash
npm install
```

#### **3. Execute o Servidor**
Inicie o servidor com o comando:
```bash
node server.js
```
O servidor será iniciado no porta 3000.

#### **4. Conecte os Dispositivos**
No computador, abra o navegador e acesse:
```bash
http://localhost:3000
```

No celular, conecte-se ao servidor utilizando o IP local da máquina onde o servidor está rodando. Substitua ```<IP_DO_SERVIDOR>``` pelo IP encontrado:
```bash
http://<IP_DO_SERVIDOR>:3000
```
Para encontrar o IP do servidor:
- **Windows: Execute o comando ```ipconfig``` no terminal e procure por "IPv4 Address".**
-  **Linux/Mac: Execute o comando ```ifconfig``` e procure por "inet".**

#### **5. Controle o Jogo**
- **No celular, utilize os botões de direção (esquerda, direita, cima, baixo) para movimentar a bolinha no canvas exibido no computador.**

## Demonstração
1. Interface do Computador
    Uma bolinha azul é exibida em um canvas de 400x400 pixels.
    A posição da bolinha será atualizada conforme os inputs enviados pelo celular.
3. Interface do Celular
   Quatro botões (esquerda, direita, cima, baixo) permitem enviar comandos ao servidor.

## Autoria
- Arthur Octário Vellasco
- Leon Stevans Farias de Souza 
- Rafael Rocha Damasceno

   




