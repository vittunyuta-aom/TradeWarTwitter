const server = require('express')()
const Twitter = require('twitter')
const socketIO = require('socket.io')
var firebase = require('firebase');
var appdb = firebase.initializeApp({
    apiKey: "AIzaSyA4A084RgNIa_8iwZJ7hTijJjzKBqAjjDU",
    authDomain: "blackpinkapi.firebaseapp.com",
    databaseURL: "https://blackpinkapi.firebaseio.com",
    projectId: "blackpinkapi",
    storageBucket: "blackpinkapi.appspot.com",
    messagingSenderId: "925066816671",
    appId: "1:925066816671:web:e7563c7c91b3771c"
});

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


let events = []
appdb.database().ref('tweets').once('value', function (snapshots) {
    if (snapshots.val()) {
        events = Object.values(snapshots.val())
    }
})

const io = socketIO.listen(app)
// รอการ connect จาก client
io.on('connection', client => {
    console.log('user connected')
    io.sockets.emit('messages', events)
    // เมื่อ Client ตัดการเชื่อมต่อ
    client.on('disconnect', () => {
        console.log('user disconnected')
    })
})

const stream = client.stream('statuses/filter', { track: '#tradewar' })
stream.on('data', function (event) {
    if (event) {
        console.log(event)
        console.log('-------------------------------------------------')
        // io.sockets.emit('new-message', event)
        events.push(event)
        io.sockets.emit('messages', events)
        appdb.database().ref('tweets').set(events)
    }
})

