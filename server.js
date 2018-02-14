var express = require("express")
var mongoose = require("mongoose")
var bodyParser = require("body-parser")

var app = express()
var http = require("http").Server(app)
var io = require("socket.io")(http)

var conString = "mongodb://localhost/chatApp";
app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

mongoose.Promise = Promise

var Chats = mongoose.model("Chats", {
    name: String,
    chat: String
})

mongoose.connect(conString, (err) => {
    console.log("Database connection", err)
})

app.post("/chats", async (req, res) => {
    try {
        var chat = new Chats(req.body)
        await chat.save()
        res.sendStatus(200)
        //Emit the event
        io.emit("chat", req.body)
    } catch (error) {
        res.sendStatus(500)
        console.error(error)
    }
})

app.get("/chats", (req, res) => {
    Chats.find({}, (error, chats) => {
        res.send(chats)
    })
})

io.on("connection", (socket) => {
    console.log("Socket is connected...")
})

var server = http.listen(3020, () => {
    console.log("listening on ", server.address().port)
})