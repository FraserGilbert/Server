import World from '#lostcity/engine/World.ts';
import ScriptProvider from '#lostcity/engine/script/ScriptProvider.ts';
import ScriptRunner from '#lostcity/engine/script/ScriptRunner.ts';
import Player from '#lostcity/entity/Player.ts';

import Environment from '#lostcity/util/Environment.ts';

Environment.CLIRUNNER = true;

const args = process.argv.slice(2);

await World.start(false);

const script = ScriptProvider.getByName(`[debugproc,${args[0]}]`);
if (!script) {
    console.error(`Script [debugproc,${args[0]}] not found`);
    Deno.exit(1);
}

const self = Player.load('clirunner');
World.addPlayer(self, null);
await World.cycle(false);

const state = ScriptRunner.init(script, self);
ScriptRunner.execute(state);

Deno.exit(0);
