import { ServerWebSocket } from 'bun';

import Packet from 'jagex2/io/Packet.js';

import World from 'lostcity/engine/World.js';
import Login from 'lostcity/engine/Login.js';

import ClientSocket from 'lostcity/server/ClientSocket.js';

export default class WSServer {
    start() {
        Bun.serve({
            fetch(req, server) {
                const success = server.upgrade(req, {
                    data: {
                        ip: req.headers.get('x-forwarded-for') || server.requestIP(req)
                    }
                });
                if (success) {
                    return;
                }

                return new Response('Upgrade Required', { status: 500 });
            },
            websocket: {
                open(ws: ServerWebSocket<unknown>) {
                    // @ts-expect-error - data has no type
                    const { ip } = ws.data;
                    const socket = new ClientSocket(ws, ip.address, ClientSocket.WEBSOCKET);

                    const seed = Packet.alloc(8);
                    // can't do seed.p8(random) because JS is based around doubles (53-bits)
                    seed.p4(Math.floor(Math.random() * 0xFFFFFFFF));
                    seed.p4(Math.floor(Math.random() * 0xFFFFFFFF));
                    socket.send(seed.data);

                    // @ts-expect-error - data has no type
                    ws.data.socket = socket;
                },
                close(ws, code, reason) {
                    // @ts-expect-error - data has no type
                    const { socket } = ws.data;

                    if (socket.state === 1) {
                        World.removePlayerBySocket(socket);
                    }
                },
                message(ws, message) {
                    // @ts-expect-error - data has no type
                    const { socket } = ws.data;
                    const packet = new Packet(message as Buffer);

                    if (socket.state === 1) {
                        World.readIn(socket, packet);
                    } else {
                        Login.readIn(socket, packet);
                    }
                }
            },
            port: Number(process.env.GAME_PORT) + 1
        });

        console.log(`[WSWorld]: Listening on port ${Number(process.env.GAME_PORT) + 1}`);
    }
}
