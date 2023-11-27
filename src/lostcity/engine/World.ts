import Packet from '#jagex2/io/Packet.js';

import PathFinder from '#rsmod/PathFinder.js';
import LinePathFinder from '#rsmod/LinePathFinder.js';
import CollisionFlagMap from '#rsmod/collision/CollisionFlagMap.js';

import CategoryType from '#lostcity/cache/CategoryType.js';
import DbRowType from '#lostcity/cache/DbRowType.js';
import DbTableType from '#lostcity/cache/DbTableType.js';
import EnumType from '#lostcity/cache/EnumType.js';
import FontType from '#lostcity/cache/FontType.js';
import HuntType from '#lostcity/cache/HuntType.js';
import IdkType from '#lostcity/cache/IdkType.js';
import IfType from '#lostcity/cache/IfType.js';
import InvType from '#lostcity/cache/InvType.js';
import LocType from '#lostcity/cache/LocType.js';
import MesanimType from '#lostcity/cache/MesanimType.js';
import NpcType from '#lostcity/cache/NpcType.js';
import ObjType from '#lostcity/cache/ObjType.js';
import ParamType from '#lostcity/cache/ParamType.js';
import SeqFrame from '#lostcity/cache/SeqFrame.js';
import SeqType from '#lostcity/cache/SeqType.js';
import StructType from '#lostcity/cache/StructType.js';
import VarNpcType from '#lostcity/cache/VarNpcType.js';
import VarPlayerType from '#lostcity/cache/VarPlayerType.js';

import { Inventory } from '#lostcity/engine/Inventory.js';
import GameMap from '#lostcity/engine/GameMap.js';

import CollisionManager from '#lostcity/engine/collision/CollisionManager.js';

import ScriptProvider from '#lostcity/engine/script/ScriptProvider.js';
import ScriptState from '#lostcity/engine/script/ScriptState.js';

import Npc from '#lostcity/entity/Npc.js';
import Player from '#lostcity/entity/Player.js';

import { ClientProtLengths } from '#lostcity/server/ClientProt.js';
import ClientSocket from '#lostcity/server/ClientSocket.js';

class World {
    members = process.env.MEMBERS_WORLD === 'true';
    currentTick = 0;
    shutdownTick = -1;

    gameMap = new GameMap();

    playerIds: number[] = new Array(2048); // indexes into players
    players: Player[] = [];

    npcIds: number[] = new Array(8192); // indexes into npcs
    npcs: Npc[] = [];

    invs: Inventory[] = []; // shared inventories (shops)

    constructor() {
        this.playerIds.fill(-1);
        this.npcIds.fill(-1);
    }

    get collisionManager(): CollisionManager {
        return this.gameMap.collisionManager;
    }

    get collisionFlags(): CollisionFlagMap {
        return this.collisionManager.flags;
    }

    get pathFinder(): PathFinder {
        return this.collisionManager.pathFinder;
    }

    get linePathFinder(): LinePathFinder {
        return this.collisionManager.linePathFinder;
    }

    start(skipMaps = false) {
        console.log('Starting world...');

        // console.time('Loading category.dat');
        CategoryType.load('data/pack/server');
        // console.timeEnd('Loading category.dat');

        // console.time('Loading dbtable.dat');
        DbTableType.load('data/pack/server');
        // console.timeEnd('Loading dbtable.dat');

        // console.time('Loading dbrow.dat');
        DbRowType.load('data/pack/server');
        // console.timeEnd('Loading dbrow.dat');

        // console.time('Loading enum.dat');
        EnumType.load('data/pack/server');
        // console.timeEnd('Loading enum.dat');

        // console.time('Loading param.dat');
        ParamType.load('data/pack/server');
        // console.timeEnd('Loading param.dat');

        // console.time('Loading struct.dat');
        StructType.load('data/pack/server');
        // console.timeEnd('Loading struct.dat');

        // console.time('Loading obj.dat');
        ObjType.load('data/pack/server', this.members);
        // console.timeEnd('Loading obj.dat');

        // console.time('Loading loc.dat');
        LocType.load('data/pack/server');
        // console.timeEnd('Loading loc.dat');

        // console.time('Loading npc.dat');
        NpcType.load('data/pack/server');
        // console.timeEnd('Loading npc.dat');

        // console.time('Loading idk.dat');
        IdkType.load('data/pack/server');
        // console.timeEnd('Loading idk.dat');

        // console.time('Loading inv.dat');
        InvType.load('data/pack/server');
        // console.timeEnd('Loading inv.dat');

        // console.time('Loading varn.dat');
        VarNpcType.load('data/pack/server');
        // console.timeEnd('Loading varn.dat');

        // console.time('Loading varp.dat');
        VarPlayerType.load('data/pack/server');
        // console.timeEnd('Loading varp.dat');

        // console.time('Loading interface.dat');
        IfType.load('data/pack/server');
        // console.timeEnd('Loading interface.dat');

        // console.time('Loading frame_del.dat');
        SeqFrame.load('data/pack/server');
        // console.timeEnd('Loading frame_del.dat');

        // console.time('Loading seq.dat');
        SeqType.load('data/pack/server');
        // console.timeEnd('Loading seq.dat');

        // console.time('Loading fonts');
        FontType.load('data/pack/client');
        // console.timeEnd('Loading fonts');

        // console.time('Loading mesanim.dat');
        MesanimType.load('data/pack/server');
        // console.timeEnd('Loading mesanim.dat');

        // console.time('Loading hunt.dat');
        HuntType.load('data/pack/server');
        // console.timeEnd('Loading hunt.dat');

        // console.time('Loading script.dat');
        ScriptProvider.load('data/pack/server');
        // console.timeEnd('Loading script.dat');

        if (!skipMaps) {
            this.gameMap.init();
        }

        for (let i = 0; i < InvType.count; i++) {
            const inv = InvType.get(i);

            if (inv && inv.scope === InvType.SCOPE_SHARED) {
                this.invs.push(Inventory.fromType(i));
            }
        }

        console.log('World ready!');
        this.cycle();
    }

    cycle() {
        const start = Date.now();

        // world processing
        // - world queue
        // - npc spawn scripts
        // - npc hunt

        // client input
        // - decode packets
        for (let i = 0; i < this.playerIds.length; i++) {
            if (this.playerIds[i] === -1) {
                continue;
            }

            const player = this.players[this.playerIds[i]];
            if (!player) {
                this.playerIds[i] = -1;
                continue;
            }

            if (!player.client) {
                continue;
            }

            player.decodeIn();
        }

        // npc processing (if npc is not busy)
        // - resume suspended script
        // - stat regen
        // - timer
        // - queue
        // - movement
        // - modes

        // player processing
        // - resume suspended script
        // - primary queue
        // - weak queue
        // - timers
        // - soft timers
        // - engine queue
        // - loc/obj interactions
        // - movement
        // - player/npc interactions
        // - close interface if attempting to logout
        for (let i = 0; i < this.playerIds.length; i++) {
            if (this.playerIds[i] === -1) {
                continue;
            }

            const player = this.players[this.playerIds[i]];
            if (!player) {
                this.playerIds[i] = -1;
                continue;
            }

            player.playtime++;

            if (player.delayed()) {
                player.delay--;
            }

            if (player.activeScript && !player.delayed() && player.activeScript.execution === ScriptState.SUSPENDED) {
                player.executeScript(player.activeScript);
            }

            player.queue = player.queue.filter(s => s);
            if (player.queue.find(s => s.type === 'strong')) {
                // the presence of a strong script closes modals before anything runs regardless of the order
                player.closeModal();
            }

            player.processQueues();

            player.processTimers('normal');
            player.processTimers('soft');

            player.processEngineQueue();

            player.processInteraction();

            if ((player.mask & Player.EXACT_MOVE) == 0) {
                player.validateDistanceWalked();
            }

            if (player.logoutRequested) {
                player.closeModal();
            }
        }

        // player logout

        // loc/obj despawn/respawn

        // client output
        // - map update
        // - player info
        // - npc info
        // - zone updates
        // - inv changes
        // - stat changes
        // - flush packets
        for (let i = 0; i < this.playerIds.length; i++) {
            if (this.playerIds[i] === -1) {
                continue;
            }

            const player = this.players[this.playerIds[i]];
            if (!player) {
                this.playerIds[i] = -1;
                continue;
            }

            if (!player.client) {
                continue;
            }

            player.updateMap();
            player.updatePlayers();
            player.updateNpcs();
            player.updateZones();
            player.updateInvs();
            player.updateStats();

            player.encodeOut();
        }

        // reset entity masks
        for (let i = 0; i < this.playerIds.length; i++) {
            if (this.playerIds[i] === -1) {
                continue;
            }

            const player = this.players[this.playerIds[i]];
            if (!player) {
                this.playerIds[i] = -1;
                continue;
            }

            player.resetEntity(false);
        }

        const end = Date.now();
        // console.log(`tick ${this.currentTick} took ${end - start}ms`);

        this.currentTick++;

        if (this.shutdownTick > -1 && this.currentTick >= this.shutdownTick) {
            for (let i = 0; i < this.players.length; i++) {
                const player = this.players[i];
                if (player) {
                    player.logout();
                }
            }
        }

        const nextTick = 600 - (end - start);
        setTimeout(this.cycle.bind(this), nextTick);
    }

    readIn(socket: ClientSocket, stream: Packet) {
        while (stream.available > 0) {
            const start = stream.pos;
            let opcode = stream.g1();

            if (socket.decryptor) {
                opcode = (opcode - socket.decryptor.nextInt()) & 0xFF;
                stream.data[start] = opcode;
            }

            let length = ClientProtLengths[opcode];
            if (typeof length === 'undefined') {
                socket.state = -1;
                socket.close();
                return;
            }

            if (length === -1) {
                length = stream.g1();
            } else if (length === -2) {
                length = stream.g2();
            }

            if (stream.available < length) {
                break;
            }

            stream.pos += length;

            socket.inCount[opcode]++;
            if (socket.inCount[opcode] > 10) {
                continue;
            }

            socket.in.set(stream.gdata(stream.pos - start, start, false), socket.inOffset);
            socket.inOffset += stream.pos - start;
        }
    }

    addPlayer(player: Player, client: ClientSocket | null) {
        let pid = -1;

        if (client) {
            client.player = player;
            player.client = client;

            // pid = first available index starting from (low ip octet % 20) * 100
            const ip = client.remoteAddress;
            const octets = ip.split('.');
            const start = (parseInt(octets[3]) % 20) * 100;

            for (let i = 0; i < 100; i++) {
                const index = start + i;
                if (this.playerIds[index] === -1) {
                    pid = index;
                    break;
                }
            }
        }

        if (pid === -1) {
            // pid = first available index starting at 0
            for (let i = 0; i < this.playerIds.length; i++) {
                if (this.playerIds[i] === -1) {
                    pid = i;
                    break;
                }
            }
        }

        if (pid === -1) {
            // no free slots
            return false;
        }

        const index = this.players.push(player) - 1;
        this.playerIds[pid] = index;

        player.onLogin();

        return true;
    }

    // temp until login server tracks sessions independently
    findPlayer(username: string) {
        return this.players.find(x => x.username === username);
    }

    getInventory(inv: number) {
        if (inv === -1) {
            return null;
        }

        let container = this.invs.find(x => x.type == inv);
        if (!container) {
            container = Inventory.fromType(inv);
            this.invs.push(container);
        }
        return container;
    }
}

export default new World();
