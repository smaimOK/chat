const express = require('express')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);

var users = {}

app.use(express.static(__dirname + '/public'));

app.get('/chat', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', function(socket){
  users[socket.id] = {name: "noname"}
  socket.emit("upUsers", users)
  socket.broadcast.emit("upUsers", users)
  console.log('a user connected', socket.id)

  socket.on('disconnect', function(){
    delete users[socket.id]
    socket.broadcast.emit("upUsers", users)
    console.log('user disconnected', socket.id)
  });

  socket.on('newMessage', function(data){
    socket.broadcast.emit("newMessage", data)
  });

  socket.on('setName', function(name){
    users[socket.id].name = name
    socket.emit("upUsers", users)
    socket.broadcast.emit("upUsers", users)
  });

});


http.listen(3000,'192.168.0.103', () => {
  console.log('server start!')
})
