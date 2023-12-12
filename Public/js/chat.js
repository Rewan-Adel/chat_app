//this script connect to the server and listens for events
let socket = io(); // this is the connection to the backend
//using function instead of arrow function because it is supported in all browsers
   
socket.on('connect', function(){
    console.log('connected to the server');
    let params = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(params).replace(/&/g,'","').replace('?','').replace(/=/g,'":"') +'"}');

    socket.emit('join', params, function(err){
        if(err){
            alert(err);
            window.location.href = '/';
        }
        else
              console.log('No error');    
    })

    console.log(params);
});


function scrollToBottom(){
    let messages = document.querySelector("#message").lastElementChild;
    messages.scrollIntoView();
}

//listing message from server side
socket.on('newMsg', function(message){
    console.log('new message: ', message);
    let template = document.querySelector('#template-msg').innerHTML;
    let html = Mustache.render(template, {
        from : message.from,
        text : message.text,
        createdAt : moment(message.createdAt).format('LT')
    }) 

   let div = document.createElement('div');
   div.innerHTML = html;

    document.querySelector('#message').appendChild(div);
    scrollToBottom();
});


socket.on('newLocationMsg', function(message){
    console.log('Location  ', message);
    let template = document.querySelector('#location-template-msg').innerHTML;
    let html = Mustache.render(template, {
        from : message.from,
        url : message.url,
        createdAt : moment(message.createdAt).format('LT')
    })
   
    let div  = document.createElement('div');
    div.innerHTML = html;
    
    document.querySelector('#message').appendChild(div);
    scrollToBottom();
});

socket.on('updateUserList', function(users){
    console.log('Users List', users);
    let ol = document.createElement('ol');
    users.forEach(function(user){
        let li = document.createElement('li');
        li.innerHTML = user;
        ol.appendChild(li);
    });
    document.querySelector('#users').innerHTML = ol.innerHTML;
});
socket.on('disconnect', function(){
    console.log('disconnected to the server');
});

//Sending message when user press at the button
document.querySelector('#message-btn').addEventListener('click', function(e){
    e.preventDefault(); //prevent reload the page
    let params = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(params).replace(/&/g,'","').replace('?','').replace(/=/g,'":"') +'"}');
    socket.emit('createMessage', {
        from:params.user,
        text: document.querySelector('input[name="message"]').value
    }, function(){

    })
});
document.querySelector('#location-btn').addEventListener('click', function(e){
    e.preventDefault(); //prevent reload the page
    
    if(! navigator.geolocation)
       return alert('Location is not supported by your browser.')
    navigator.geolocation.getCurrentPosition(function(position){
        console.log("Position", position);
        
        socket.emit('locationMsg', {
            lat : position.coords.latitude,
            lon : position.coords.longitude
        })

    }, function(){
        return alert('Unable to fetch your location.')
    })
});
