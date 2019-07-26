const http = require('http');
const socketio = require('socket.io');
const server = http.createServer((req,res) => {
    res.end('hey');
});

server.listen(3000);

const io = socketio.listen(server);



io.on('connection' , (socket) => {
    console.log('user connected');

    socket.on('joinRoom' , (data) => {

        //1. parametre hangi odaya katılmak istediğini belirtir
        //oda yoksa oluşturur
       socket.join(data.name, () => {
           //odaya katıldığında diğer kullanıcılara gönderilmesi için
           //data.name oda adı !
           //socket.to dersem aktif tcp bağlantısı hariç herkese gönderecek
           let count = io.sockets.adapter.rooms[data.name].length; //odadaki kişi sayısı
           io.to(data.name).emit('new join' , {count});
           //herkese gönderecek kendisi dahil
           //io.to(data.name).emit('new join');

           socket.emit('log' , {message:'odaya girdiniz'});

       });


    });





});