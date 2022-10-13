const http2 = require ("http2")
const fs = require("fs")
const WebSocketServer = require("websocket").server
let connection = null;
const settings = { enableConnectProtocol: true };

const httpserver = http2.createSecureServer({
    settings ,
    "key": fs.readFileSync("/root/nodejs-demo/ns-root.key"),
    "cert": fs.readFileSync("/root/nodejs-demo/ns-root.cert")
})

const websocket = new WebSocketServer({
    
    "httpServer": httpserver
})

httpserver.listen(8888);
console.log("listening on port 8080");

httpserver.on("stream", (stream, headers) => {
    console.log(stream.id);
    
    websocket.on("stream", (stream, headers)=> {
        console.log(stream);

        connection = stream.accept(null, stream.origin)
        connection.on("open", () => console.log("Opened!!!"))
        connection.on("close", () => console.log("CLOSED!!!"))
        connection.on("message", message => {
    
            console.log(`Received message ${message.utf8Data}`)
            connection.send(`got your message: ${message.utf8Data}`)
        })
    
    
        //use connection.send to send stuff to the client 
    sendevery5seconds();
    }) 
    stream.respond({
        "content-type": "application/json",
        "status": 200
    })

    

})



//when a legit websocket request comes listen to it and get the connection .. once you get a connection thats it! 

function sendevery5seconds(){

    connection.send(`Message ${Math.random()}`);

    setTimeout(sendevery5seconds, 1000);
}
