"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var https_1 = __importDefault(require("https"));
var socket_io_1 = require("socket.io");
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var environment_1 = require("./config/environment");
var socket_1 = __importDefault(require("./socket/socket"));
var app = (0, express_1.default)();
var server = http_1.default.createServer(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    },
});
app.get('/', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, '../public', 'index.html'));
});
io.on('connection', function (socket) { return (0, socket_1.default)(socket, io); });
if (environment_1.config.mode === 'development') {
    server.listen(environment_1.config.devPort, function () {
        return console.log(">> HTTP server running at http://localhost:".concat(environment_1.config.devPort));
    });
}
else {
    var privateKey = fs_1.default.readFileSync("/etc/letsencrypt/live/".concat(environment_1.config.domain, "/privkey.pem"), 'utf8');
    var certificate = fs_1.default.readFileSync("/etc/letsencrypt/live/".concat(environment_1.config.domain, "/cert.pem"), 'utf8');
    var ca = fs_1.default.readFileSync("/etc/letsencrypt/live/".concat(environment_1.config.domain, "/chain.pem"), 'utf8');
    var credentials = { key: privateKey, cert: certificate, ca: ca };
    var httpsServer = https_1.default.createServer(credentials, app);
    httpsServer.listen(environment_1.config.prodPort, function () {
        return console.log(">> HTTPS server running at https://".concat(environment_1.config.domain, ":").concat(environment_1.config.prodPort));
    });
}
