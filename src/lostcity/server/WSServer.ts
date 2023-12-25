import { IncomingMessage } from 'node:http';

import { WebSocketServer, WebSocket } from 'ws';

import Packet from '#jagex2/io/Packet.ts';

import Login from '#lostcity/engine/Login.ts';
import World from '#lostcity/engine/World.ts';

import ClientSocket from '#lostcity/server/ClientSocket.ts';

import Environment from '#lostcity/util/Environment.ts';

function getIp(req: IncomingMessage) {
    return '127.0.0.1';
}

// TODO: keepalives
export default class WSServer {
    wss: WebSocketServer | null = null;

    start() {
        const port = ((Environment.GAME_PORT as number) + 1);

        this.wss = new WebSocketServer({ port, host: '0.0.0.0' }, () => {
            console.log(`[WSWorld]: Listening on port ${port}`);
        });

        this.wss.on('connection', (ws: WebSocket, req: any) => {
            const ip: string = getIp(req) ?? 'unknown';
            console.log(`[WSWorld]: Connection from ${ip}`);

            const socket = new ClientSocket(ws, ip, ClientSocket.WEBSOCKET);

            const seed = Packet.alloc(8);
            seed.p4(Math.floor(Math.random() * 0xFFFFFFFF));
            seed.p4(Math.floor(Math.random() * 0xFFFFFFFF));
            socket.send(seed.data);

            ws.on('message', async (data: any) => {
                const packet = new Packet(data);

                if (socket.state === 1) {
                    await World.readIn(socket, packet);
                } else {
                    await Login.readIn(socket, packet);
                }
            });

            ws.on('close', () => {
                console.log(`[WSWorld]: Disconnected from ${ip}`);

                if (socket.player) {
                    socket.player.client = null;
                }
            });

            ws.on('error', () => {
                socket.terminate();
            });
        });
    }
}
