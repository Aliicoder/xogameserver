"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var activePlayers = new Map();
var handleConnections = function (socket, io) {
    socket.on("player>>connect>>opponent", function (_a) {
        var _b;
        var roomId = _a.roomId, player = _a.player;
        console.log(" player >>", player.firstName);
        console.log("created ".concat(roomId, " room"));
        var activePlayerSocketId = socket.id;
        activePlayers.set(roomId, activePlayerSocketId);
        socket.join(roomId);
        if (((_b = io.sockets.adapter.rooms.get(roomId)) === null || _b === void 0 ? void 0 : _b.size) === 2)
            io.in(roomId).emit("exchange_data");
    });
    socket.on("player>>data>>opponent", function (_a) {
        var roomId = _a.roomId, player = _a.player;
        console.log("player>>data>>opponent");
        socket.broadcast.to(roomId).emit("opponent<<data<<player", { player: player });
    });
    socket.on("player>>turns>>opponent", function (_a) {
        var roomId = _a.roomId, turns = _a.turns, lock = _a.lock;
        console.log("player>>turns>>opponent");
        socket.broadcast.to(roomId).emit("opponent<<turns<<player", { turns: turns });
    });
};
exports.default = handleConnections;
