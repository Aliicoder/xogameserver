import express from 'express';
import http from 'http';
import https from 'https';
import { Server as socketIo,Socket } from 'socket.io'
import path from 'path';
import fs from 'fs';
import { config } from './config/environment';
import handleConnections from './socket/socket';

const app = express();

const server = http.createServer(app);
const io = new socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  },
});

app.get('/', (req, res) =>{
  res.sendFile(path.join(__dirname,'../public','index.html'));
})


io.on('connection',(socket)=>handleConnections(socket,io))


if (config.mode === 'development') {
  server.listen(config.devPort, () =>
    console.log(`>> HTTP server running at http://localhost:${config.devPort}`)
  );
} else {
  const privateKey = fs.readFileSync(`/etc/letsencrypt/live/${config.domain}/privkey.pem`, 'utf8');
  const certificate = fs.readFileSync(`/etc/letsencrypt/live/${config.domain}/cert.pem`, 'utf8');
  const ca = fs.readFileSync(`/etc/letsencrypt/live/${config.domain}/chain.pem`, 'utf8');
  const credentials = { key: privateKey, cert: certificate, ca };
  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(config.prodPort, () =>
    console.log(`>> HTTPS server running at https://${config.domain}:${config.prodPort}`)
  );
}

