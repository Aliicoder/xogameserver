import { Server, Socket } from 'socket.io'

const activePlayers = new Map()
const handleConnections = function(socket:Socket,io:Server){
  socket.on("player>>connect>>opponent",({roomId,player})=>{
    console.log(" player >>",player.firstName)
    console.log(`created ${roomId} room`)
    let activePlayerSocketId = socket.id
    activePlayers.set(roomId,activePlayerSocketId)
    socket.join(roomId)
    if(io.sockets.adapter.rooms.get(roomId)?.size === 2)
       io.in(roomId).emit("exchange_data");
  })
  socket.on("player>>data>>opponent",({roomId,player})=>{
    console.log("player>>data>>opponent")
    socket.broadcast.to(roomId).emit("opponent<<data<<player",{player})
  })
  socket.on("player>>turns>>opponent",({roomId,turns,lock})=>{
    console.log("player>>turns>>opponent")
    socket.broadcast.to(roomId).emit("opponent<<turns<<player",{turns})
  })
}

export default handleConnections