const io = require('socket.io')(3000,{
    cors: {
        origin:['http://localhost:8080',
        'https://www.youtube.com'],
    }
})

io.on('connection', socket =>{
    socket.on("play-video", ()=>{
        socket.broadcast.emit("play-video");
    })
    socket.on("pause-video", ()=>{
        socket.broadcast.emit("pause-video");
    })
    socket.on("video-change", (videoId)=>{
        socket.broadcast.emit("video-change",videoId);
    })
    socket.on("time-change", (currentTime)=>{
        socket.broadcast.emit("time-change",currentTime);
    })
    socket.on("time-slide", ()=>{
        socket.broadcast.emit("time-slide");
    })
})