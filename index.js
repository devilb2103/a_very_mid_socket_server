const express = require("express");
var http = require("http");
const { type } = require("os");
const app = express();
const port = process.env.PORT || 5000;
var server = http.createServer(app);
var io = require("socket.io")(server);

//middlewre
app.use(express.json());
var users = {};
var messages = [];
var typers = {};
var typersOld = {};

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

io.on("connection", (socket) => {
  //console.log("connected: ", socket.id, "has joined");
  socket.on("signin", (id) => {
    users[socket.id] = id;
    io.sockets.emit("userChange", Object.values(users));
    socket.emit("socketId", socket.id);
  });

  socket.on("message", (msg) => {
    //console.log(msg);
    const message = {
      user: msg.user,
      id: msg.id,
      message: msg.message,
      time: msg.time
    }
    if(message.message == "clear123"){
      messages = [];
    }
    else{
      messages.push(message);
      io.sockets.emit("broadcast", message);
    }
  });

  socket.on("requestOldMessages", (id) => {
    socket.emit("retrieveOldMessages", messages);
  });

  socket.on("addTyper", (id) => {
    //send a typing broadcast
    typers[socket.id] = id;
    io.sockets.emit("typers", Object.values(typers));
  });

  socket.on("removeTyper", (id) => {
    //send a typing broadcast
    delete typers[socket.id];
    io.sockets.emit("typers", Object.values(typers));
  });

  socket.on("disconnect", (id) => {
    delete users[socket.id];
    io.sockets.emit("userChange", Object.values(users));
    try {
      delete typers[socket.id];
      io.sockets.emit("typers", Object.values(typers));
    }
    catch{
      console.log("LOL ERROR EAT DUST");
    }
  });
});

server.listen(port, () => {
  console.log("server started");
});