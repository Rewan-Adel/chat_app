const express      = require("express");
const cookieParser = require('cookie-parser');
const bodyParser   = require("body-parser");
const mongoose     = require('mongoose');
const cors         = require('cors');

const path         = require('path');
const app          = express();

const server       =  require('http').createServer(app);
const io           = require('socket.io')(server);
const {generateMsg, locationMsg}      = require('./Utils/message');

const {validString}   = require('./Utils/validation');
const publicPath   = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

let {User} = require('./Utils/Users.js'); 
let user = new User();

//this will listen to eny event from the client side
io.on('connection', (socket)=>{
    console.log('New user connected');
    
    socket.on('join', (params, callback)=>{
        console.log(params)
        if(!validString(params.user) || !validString(params.room)){
            return callback('User name and room name are required');
        }
        socket.join(params.room);
        user.addUser(socket.id, params.user, params.room); 

        io.to(params.room).emit('updateUserList', user.getUserList(params.room));
        io.emit(params.room)
        io.to(params.room).emit('newMsg', generateMsg( '', `Welcome to  ${params.room}!`));
        socket.broadcast.to(params.room).emit('newMsg', generateMsg('', `${params.user} has joined`));
    
        callback();
    })

    socket.on('createMessage', (message)=>{
        //should be io not socket to be able to send message to all not same page
        io.emit('newMsg', generateMsg(message.from, message.text));
    });
    
    socket.on('locationMsg', (coords)=>{
        io.emit('newLocationMsg', locationMsg(coords.lat, coords.lon))
    })

    socket.on('disconnect', ()=>{
        console.log('user disconnected');
          let userRemoved = user.removeUser(socket.id);
          if(userRemoved){
              io.to(userRemoved.room).emit('updateUserList', user.getUserList(userRemoved.room));
              io.to(userRemoved.room).emit('newMsg', generateMsg('admin', `${userRemoved.name} has left`));
          }  
    })

})

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true
}));


let port = process.env.PORT || 3000
server.listen(port,  ()=>{
    console.log(`Server listening in port ${port}`)
})
module.exports = app;
