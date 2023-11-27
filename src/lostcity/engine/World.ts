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

import Npc from '#lostcity/entity/Npc.js';
import Player from '#lostcity/entity/Player.js';

import { ClientProtLengths } from '#lostcity/server/ClientProt.js';
import ClientSocket from '#lostcity/server/ClientSocket.js';

class World {
    members = process.env.MEMBERS_WORLD === 'true';
    currentTick = 0;
    endTick = -1;

    players: (Player | null)[] = new Array<Player>(2048);
    npcs: (Npc | null)[] = new Array<Npc>(8192);
    gameMap = new GameMap();
    invs: Inventory[] = []; // shared inventories (shops)

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

        const end = Date.now();
        // console.log(`tick ${this.currentTick} took ${end - start}ms`);

        this.currentTick++;
        const nextTick = 600 - (end - start);
        setTimeout(this.cycle.bind(this), nextTick);
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
}

export default new World();
