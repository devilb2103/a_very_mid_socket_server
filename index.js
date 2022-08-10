const express = require("express");
var http = require("http");
const app = express();
const port = process.env.PORT || 5000;
var server = http.createServer(app);
var io = require("socket.io")(server);

//middlewre
app.use(express.json());
var users = {};

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

io.on("connection", (socket) => {
  //console.log("connected: ", socket.id, "has joined");
  socket.on("signin", (id) => {
    users[socket.id] = id;
    io.sockets.emit("userChange", Object.values(users));
    console.log(users);
  });

  socket.on("message", (msg) => {
    //console.log(msg);
    const message = {
      user: msg.user,
      message: msg.message
    } 
    io.sockets.emit("broadcast", message);
  });

  socket.on("disconnect", (id) => {
    delete users[socket.id];
    io.sockets.emit("userChange", Object.values(users));
    console.log(users);
  });
});

server.listen(port, () => {
  console.log("server started");
});