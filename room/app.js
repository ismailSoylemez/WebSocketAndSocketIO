const http = require('http');
const socketio = require('socket.io');
const server = http.createServer((req,res) => {
    res.end('hey');
});

server.listen(3000);

const io = socketio.listen(server);



io.on('connection' , (socket) => {
    console.log('user connected');

    //socket id si böyle alınıyor
    //console.log(socket.id);

    /*
    const data = { 'a': 1 ,'b': 2 ,'c': 3}; // object key
    console.log(Object.key(data)); // ['a','b','c']
    */

    //bu kullanıcı  room 1,23 e girecek
    socket.join('room 1');
    socket.join('room 2');
    socket.join('room 3' , () => {
        const  rooms = Object.keys(socket.rooms);
        console.log(rooms);
    });

    socket.on('joinRoom' , (data) => {

        //1. parametre hangi odaya katılmak istediğini belirtir
        //oda yoksa oluşturur
       socket.join(data.name, () => {
           //odaya katıldığında diğer kullanıcılara gönderilmesi için
           //data.name oda adı !
           //socket.to dersem aktif tcp bağlantısı hariç herkese gönderecek
           //let count = io.sockets.adapter.rooms[data.name].length; //odadaki kişi sayısı
           io.to(data.name).emit('new join' , {count: getOnlineCount(io,data)});
           //herkese gönderecek kendisi dahil
           //io.to(data.name).emit('new join');

           socket.emit('log' , {message:'odaya girdiniz'});
           const  rooms = Object.keys(socket.rooms);
           console.log(rooms);

       });

       //odadan ayrılmak
       socket.on('leaveRoom' , (data) => {
           socket.leave(data.name, () => {
               io.to(data.name).emit('leavedRoom' , {count: getOnlineCount(io,data)});
               socket.emit('socket.leaved', {message: 'odadan ayrıldınız'});
           });
       });

    });








});

const getOnlineCount = (io,data) => {
  const room  = io.sockets.adapter.rooms[data.name];
  return room ? room.length : 0;
};
