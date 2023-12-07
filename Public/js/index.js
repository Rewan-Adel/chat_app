let socket = io(); // this is the connection to the backend

//using function instead of arrow function because it is supported in all browsers
socket.on('connect', function(){
    console.log('connected to the server');
});

socket.on('disconnect', function(){
    console.log('disconnected to the server');
});