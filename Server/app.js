const express      = require("express");
const cookieParser = require('cookie-parser');
const bodyParser   = require("body-parser");
const mongoose     = require('mongoose');
const cors         = require('cors');

const path         = require('path');
const app          = express();
const server       =  require('http').createServer(app);
const io           = require('socket.io')(server);

const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

//this will listen to eny event from the client side
io.on('connection', (socket)=>{
    console.log('New user connected');

    socket.on('disconnect', (socket)=>{
        console.log('user disconnected');
    })
})



mongoose.connect('mongodb+srv://rewanadel:12345@cluster0.dvzmc2g.mongodb.net/chatApp')
.then(console.log("Connected..."))
.catch((err)=>{console.log(err)});


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
