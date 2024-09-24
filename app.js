const express = require("express");
const app = express();
const path = require("path");
// require('dotenv').config()
const port = process.env.PORT || 5000;

//Boyler plate of SocketIo
//For Server
const http = require("http");
const socketio = require("socket.io");
//Create a server
const server = http.createServer(app);
//socketio is function
const io = socketio(server);

//Set the EJS
app.set("view engine", "ejs");
//SetUp the Static File
app.use(express.static(path.join(__dirname, "public")));

//To Connect the io
io.on("connection", function (socket) {
  //This listens for a specific event from the client.
  socket.on("send-location", function (data) {
    io.emit("receive-location", { id: socket.id, ...data });
  });
  socket.on("disconnect", function () {
    io.emit("user-disconnect", socket.id);
  });
});

app.get("/", function (req, res) {
  res.render("index");
});

server.listen(port, () =>
  console.log("> Server is up and running on port : " + port)
);
