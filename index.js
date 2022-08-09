const express = require("express");
const app = express();
const port = process.env.PORT || 6969;

app.use(express.json())

var chats = []

function clearChat() {
    if(chats.length != 0){
        chats = [];
    }
}

app.get("/", (req, res) => {
    res.send("server is up and walking")
});

app.get("/chat", (req, res) => {
    res.send(chats)
});

app.post("/schat", (req, res) => {
    const msg = {
        id: chats.length + 1,
        name: req.body.name
    };
    if(msg.name == ">cls") {
        clearChat()
    }
    else{
        chats.push(msg)
    }
    res.send(msg);
});

app.listen(port, () => console.log("listening at port...."));