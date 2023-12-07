const express      = require("express");
const app          = express();
const cookieParser = require('cookie-parser');
const bodyParser   = require("body-parser");
const mongoose     = require('mongoose');
const cors         = require('cors');

const path = require('path');
const publicPath = path.join(__dirname, '..', 'public');
console.log(publicPath)
app.use(express.static(publicPath));

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
app.listen(port,  ()=>{
    console.log(`Server listening in port ${port}`)
})
module.exports = app;
