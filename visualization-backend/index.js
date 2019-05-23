const server = require('express')()
const Twitter = require('twitter')
const socketIO = require('socket.io')
const moment = require('moment')

const port = 4000
const app = server.listen(port, () => {
    console.log('Server is listening at ' + port)
})

var client = new Twitter({
    consumer_key: 'SM4i5WsJkQ49HAMj3SM1EwEVO',
    consumer_secret: 'OkgCkh7bp9M0BBhV0er8ijntmHUp1gd9VaohyLil0mpCXOSPFS',
    access_token_key: '1391258137-oF3Xf3qmMTiPVfFfAh5MtCSZizRKnkfHIEmVTNs',
    access_token_secret: '9YE7FP2tVTjpsxsgDHvJYKPfhArSRxxfR7nHb2hKHiur3'
});

const io = socketIO.listen(app)
// รอการ connect จาก client
io.on('connection', client => {
    console.log('user connected')

    // เมื่อ Client ตัดการเชื่อมต่อ
    client.on('disconnect', () => {
        console.log('user disconnected')
    })
})

const stream = client.stream('statuses/filter', { track:'#tradewar'})
stream.on('data', function (event) {
    if (event){
        console.log(event.created_at)
        console.log('-------------------------------------------------')
        io.sockets.emit('new-message', event )
    }
})

