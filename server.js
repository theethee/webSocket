const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 3000;

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log(`A client with id ${socket.id} connected to the chat!`);

  // Tar emot meddelande
  socket.on("chatMessage", (msg) => {
    console.log("Meddelande mottaget på servern:", msg);
    console.log("Meddelande: " + msg.user + " " + msg.message);
    // Skickar
    io.emit("newChatMessage", msg.user + " : " + msg.message);

    // skickar meddelande
    io.emit("newChatMessage", { user: msg.user, message: msg.message });
  });

  // Dice game
  socket.on("gameResult", (msg) => {
    console.log("Game result: " + msg.user + " " + msg.result);
    console.log(msg);

    io.emit("newGameResult", {
      user: msg.user,
      result: msg.result,
      currentTotal: msg.currentTotal,
    });

    io.emit("diceValue", msg.result);

    // Skickar
    // Byta ut 6:an
    if (msg.currentTotal >= 21) {
      io.emit("Winner", msg.user);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected!`);
  });
});

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
