import net from 'net';

import ClientSocket from '#lostcity/server/ClientSocket.js';
import Packet from '#jagex2/io/Packet.js';

export default class TcpServer {
    tcp = null;

    constructor() {
        this.tcp = net.createServer();
    }

    start() {
        this.tcp.on('connection', (s) => {
            s.setTimeout(30000);
            s.setNoDelay(true);

            const ip = s.remoteAddress;
            console.log(`Server connection from ${ip}`);

            let socket = new ClientSocket(s, ip, ClientSocket.TCP);

            let seed = new Packet(8);
            seed.p4(Math.floor(Math.random() * 0xFFFFFFFF));
            seed.p4(Math.floor(Math.random() * 0xFFFFFFFF));
            socket.send(seed.data);

            s.on('data', (data) => {
            });

            s.on('close', () => {
                console.log(`Server disconnected from ${socket.remoteAddress}`);
            });

            s.on('end', () => {
                socket.terminate();
            });

            s.on('error', (err) => {
                socket.terminate();
            });

            s.on('timeout', () => {
                socket.terminate();
            });
        });

        this.tcp.listen(Number(process.env.GAME_PORT), '0.0.0.0', () => {
            console.log(`[Server]: Listening on port ${Number(process.env.GAME_PORT)}`);
        });
    }
}
