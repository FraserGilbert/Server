import path from 'node:path';

import Script from '#lostcity/engine/script/Script.ts';
import ScriptOpcode from '#lostcity/engine/script/ScriptOpcode.ts';
import ScriptPointer from '#lostcity/engine/script/ScriptPointer.ts';
import ScriptState from '#lostcity/engine/script/ScriptState.ts';

import CoreOps from '#lostcity/engine/script/handlers/CoreOps.ts';
import DbOps from '#lostcity/engine/script/handlers/DbOps.ts';
import DebugOps from '#lostcity/engine/script/handlers/DebugOps.ts';
import EnumOps from '#lostcity/engine/script/handlers/EnumOps.ts';
import InvOps from '#lostcity/engine/script/handlers/InvOps.ts';
import LocOps from '#lostcity/engine/script/handlers/LocOps.ts';
import LocConfigOps from '#lostcity/engine/script/handlers/LocConfigOps.ts';
import NpcOps from '#lostcity/engine/script/handlers/NpcOps.ts';
import NpcConfigOps from '#lostcity/engine/script/handlers/NpcConfigOps.ts';
import NumberOps from '#lostcity/engine/script/handlers/NumberOps.ts';
import ObjOps from '#lostcity/engine/script/handlers/ObjOps.ts';
import ObjConfigOps from '#lostcity/engine/script/handlers/ObjConfigOps.ts';
import PlayerOps from '#lostcity/engine/script/handlers/PlayerOps.ts';
import ServerOps from '#lostcity/engine/script/handlers/ServerOps.ts';
import StringOps from '#lostcity/engine/script/handlers/StringOps.ts';

import Entity from '#lostcity/entity/Entity.ts';
import { ScriptArgument } from '#lostcity/entity/EntityQueueRequest.ts';
import Loc from '#lostcity/entity/Loc.ts';
import Obj from '#lostcity/entity/Obj.ts';
import Npc from '#lostcity/entity/Npc.ts';
import Player from '#lostcity/entity/Player.ts';

export type CommandHandler = (state: ScriptState) => void;
export type CommandHandlers = {
    [opcode: number]: CommandHandler
}

// script executor
export default class ScriptRunner {
    static readonly HANDLERS: CommandHandlers = {
        // Language required opcodes
        ...CoreOps,
        ...ServerOps,
        ...PlayerOps,
        ...NpcOps,
        ...LocOps,
        ...ObjOps,
        ...NpcConfigOps,
        ...LocConfigOps,
        ...ObjConfigOps,
        ...InvOps,
        ...EnumOps,
        ...StringOps,
        ...NumberOps,
        ...DbOps,
        ...DebugOps,
    };

    /**
     *
     * @param script
     * @param self
     * @param target
     * @param on
     * @param args
     */
    static init(script: Script, self: Entity | null = null, target: Entity | null = null, on = null, args: ScriptArgument[] | null = []) {
        const state = new ScriptState(script, args);
        state.self = self;

        if (self instanceof Player) {
            state._activePlayer = self;
            state.pointerAdd(ScriptPointer.ActivePlayer);
        } else if (self instanceof Npc) {
            state._activeNpc = self;
            state.pointerAdd(ScriptPointer.ActiveNpc);
        } else if (self instanceof Loc) {
            state._activeLoc = self;
            state.pointerAdd(ScriptPointer.ActiveLoc);
        } else if (self instanceof Obj) {
            state._activeObj = self;
            state.pointerAdd(ScriptPointer.ActiveObj);
        }

        if (target instanceof Player) {
            if (self instanceof Player) {
                state._activePlayer2 = target;
                state.pointerAdd(ScriptPointer.ActivePlayer2);
            } else {
                state._activePlayer = target;
                state.pointerAdd(ScriptPointer.ActivePlayer);
            }
        } else if (target instanceof Npc) {
            if (self instanceof Npc) {
                state._activeNpc2 = target;
                state.pointerAdd(ScriptPointer.ActiveNpc2);
            } else {
                state._activeNpc = target;
                state.pointerAdd(ScriptPointer.ActiveNpc);
            }
        } else if (target instanceof Loc) {
            if (self instanceof Loc) {
                state._activeLoc2 = target;
                state.pointerAdd(ScriptPointer.ActiveLoc2);
            } else {
                state._activeLoc = target;
                state.pointerAdd(ScriptPointer.ActiveLoc);
            }
        } else if (target instanceof Obj) {
            if (self instanceof Obj) {
                state._activeObj2 = target;
                state.pointerAdd(ScriptPointer.ActiveObj2);
            } else {
                state._activeObj = target;
                state.pointerAdd(ScriptPointer.ActiveObj);
            }
        }

        return state;
    }

    static execute(state: ScriptState, reset = false, benchmark = false) {
        if (!state || !state.script || !state.script.info) {
            return ScriptState.ABORTED;
        }

        try {
            if (reset) {
                state.reset();
            }

            if (state.execution !== ScriptState.RUNNING) {
                state.executionHistory.push(state.execution);
            }
            state.execution = ScriptState.RUNNING;

            while (state.execution === ScriptState.RUNNING) {
                if (state.pc >= state.script.opcodes.length || state.pc < -1) {
                    throw new Error('Invalid program counter: ' + state.pc + ', max expected: ' + state.script.opcodes.length);
                }

                // if we're benchmarking we don't care about the opcount
                if (!benchmark && state.opcount > 500_000) {
                    throw new Error('Too many instructions');
                }

                state.opcount++;
                ScriptRunner.executeInner(state, state.script.opcodes[++state.pc]);
            }
        } catch (err: any) {
            // print the last opcode executed
            if (state.pc >= 0 && state.pc < state.script.opcodes.length) {
                const opcode = state.script.opcodes[state.pc];

                let secondary = state.intOperand;
                if (opcode === ScriptOpcode.POP_VARP || opcode === ScriptOpcode.POP_VARN ||
                    opcode === ScriptOpcode.PUSH_VARP || opcode === ScriptOpcode.PUSH_VARN)
                {
                    secondary = state.intOperand >> 16 & 0x1;
                } else if (opcode <= ScriptOpcode.POP_ARRAY_INT) {
                    secondary = 0;
                }

                err.message = ScriptOpcode[opcode].toLowerCase() + ' ' + err.message;
                if (secondary) {
                    err.message = '.' + err.message;
                }
            }

            // console.error(err);

            if (state.self instanceof Player) {
                state.self.wrappedMessageGame(`script error: ${err.message}`);
                state.self.wrappedMessageGame(`file: ${path.basename(state.script.info.sourceFilePath)}`);
                state.self.wrappedMessageGame('');

                state.self.wrappedMessageGame('stack backtrace:');
                state.self.wrappedMessageGame(`    1: ${state.script.name} - ${state.script.fileName}:${state.script.lineNumber(state.pc)}`);

                let trace = 1;
                for (let i = state.fp; i > 0; i--) {
                    const frame = state.frames[i];
                    if (frame) {
                        trace++;
                        state.self.wrappedMessageGame(`    ${trace}: ${frame.script.name} - ${frame.script.fileName}:${frame.script.lineNumber(frame.pc)}`);
                    }
                }
                for (let i = state.debugFp; i >= 0; i--) {
                    const frame = state.debugFrames[i];
                    if (frame) {
                        trace++;
                        state.self.wrappedMessageGame(`    ${trace}: ${frame.script.name} - ${frame.script.fileName}:${frame.script.lineNumber(frame.pc)}`);
                    }
                }
            }

            console.error(`script error: ${err.message}`);
            console.error(`file: ${path.basename(state.script.info.sourceFilePath)}`);
            console.error('');

            console.error('stack backtrace:');
            console.error(`    1: ${state.script.name} - ${state.script.fileName}:${state.script.lineNumber(state.pc)}`);

            let trace = 1;
            for (let i = state.fp; i > 0; i--) {
                const frame = state.frames[i];
                if (frame) {
                    trace++;
                    console.error(`    ${trace}: ${frame.script.name} - ${frame.script.fileName}:${frame.script.lineNumber(frame.pc)}`);
                }
            }
            for (let i = state.debugFp; i >= 0; i--) {
                const frame = state.debugFrames[i];
                if (frame) {
                    trace++;
                    console.error(`    ${trace}: ${frame.script.name} - ${frame.script.fileName}:${frame.script.lineNumber(frame.pc)}`);
                }
            }

            state.execution = ScriptState.ABORTED;
        }

        return state.execution;
    }

    static executeInner(state: ScriptState, opcode: number) {
        const handler = ScriptRunner.HANDLERS[opcode];
        // console.log('Executing', ScriptOpcode[opcode]);
        if (!handler) {
            throw new Error(`Unknown opcode ${opcode}`);
        }

        handler(state);
    }
}
