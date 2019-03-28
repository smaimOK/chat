const express = require('express')
const app = express() 
const bodyParser = require('body-parser')
const http = require('http').Server(app)
const io = require('socket.io')(http)
const fileUpload = require('express-fileupload')
const cors = require('cors');


app.use(bodyParser.json())
app.use(cors());

app.use(express.static(__dirname + '/public'));
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

var users = {}

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

app.post('/upload', async function(req, res) {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let sampleFile = req.files.file;

  let fullName = __dirname + '/public/static/files/' + sampleFile.name
  let visName = 'http://192.168.0.104:3000/'+'/static/files/' + sampleFile.name

  sampleFile.mv(fullName, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send({url: visName});
  })
})


http.listen(3000,'192.168.0.104', () => {
  console.log('server start!')
})
