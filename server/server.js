const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = http.createServer(app);

let users = {};

app.use(express.static("./client"));

const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("A user Connected", socket.id);

  socket.on("login", (username) => {
    users[socket.id] = username;
    
    io.emit("update-users", Object.values(users));
    console.log(`${username} has logged in`);
  });

  socket.on("send-message", (message) => {
    username = users[socket.id];
    io.emit("receive-message", { username, message });
  });
});

httpServer.listen(8080, () => {
  console.log("Connected to the server , running at http://localhost:8080");
});
