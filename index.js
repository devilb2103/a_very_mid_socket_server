const express = require("express");
var http = require("http");
const app = express();
const port = process.env.PORT || 5000;
var server = http.createServer(app);
var io = require("socket.io")(server);

//middlewre
app.use(express.json());
var clients = {};

io.on("connection", (socket) => {
  console.log("connected: ", socket.id, "has joined");
  socket.on("signin", (id) => {
    clients[id] = socket;
    console.log(Object.keys(clients));
  });
  //console.log(Object.keys(clients));

   socket.on("message", (msg) => {
    console.log(msg);
    const message = {
      user: msg.user,
      message: msg.message
    } 
    io.sockets.emit("broadcast", message);  
  });
});

server.listen(port, () => {
  console.log("server started");
});