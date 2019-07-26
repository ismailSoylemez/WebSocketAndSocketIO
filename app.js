const http = require('http');
const socketio = require('socket.io');
const server = http.createServer((req,res) => {
    res.end('hey');
});

server.listen(3000);

const io = socketio.listen(server);

io.sockets.on('connection' , (socket) => {
    console.log('kullanıcı bağlandı');

    //sunucudan cliente emit yollarken bu şekilde
    setTimeout(() => {
        socket.emit(('merhabaDe'));
    },2000);

    //clienttan gelen emiti sunucuda socket.on ile karşılıyoruz
    socket.on('selamVer', () => {
        console.log('selam');
    });

    socket.on('disconnect', () => {
        console.log('Kullanıcı Ayrıldı');
    });
});