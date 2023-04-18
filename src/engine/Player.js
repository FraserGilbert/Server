import _ from 'lodash';
import fs from 'fs';

import Packet from '#util/Packet.js';
import { fromBase37, toBase37 } from '#util/Base37.js';
import { Skills, getExpByLevel, getLevelByExp } from '#util/Experience.js';
import { Position } from '#util/Position.js';
import { properCase, titleCase } from '#util/String.js';

import { ClientProt, ClientProtSize, ClientProtOpcode } from '#enum/ClientProt.js';
import { ServerProt, ServerProtOpcode, ServerProtOpcodeFromID } from '#enum/ServerProt.js';
import AnimationNames from '#enum/AnimationNames.js';
import GraphicNames from '#enum/GraphicNames.js';
import SoundNames from '#enum/SoundNames.js';

import PlayerMovement from '#scripts/core/PlayerMovement.js';
import InventoryUpdate from '#scripts/core/InventoryUpdate.js';

import ScriptManager from '#scripts/ScriptManager.js';

import Component from '#cache/Component.js';
import NpcType from '#cache/config/NpcType.js';
import ObjectType from '#cache/config/ObjectType.js';

import { Container } from '#engine/Container.js';

import World from '#engine/World.js';
import SceneBuilder from '#cache/SceneBuilder.js';
import objs from '#cache/objs.js';
import { LevelUpDialogue } from '#scripts/core/Unlocks.js';
import { IsaacRandom } from '#util/IsaacRandom.js';

const SkillUnlocks = {
    [Skills.ATTACK]: [],
    [Skills.DEFENCE]: [],
    [Skills.STRENGTH]: [],
    [Skills.HITPOINTS]: [],
    [Skills.RANGED]: [],
    [Skills.PRAYER]: [],
    [Skills.MAGIC]: [],
    [Skills.COOKING]: [],
    [Skills.WOODCUTTING]: [],
    [Skills.FLETCHING]: [
        {
            level: 1, item: objs.bronze_arrow
        },
        {
            level: 1, item: objs.bronze_dart
        },
        {
            level: 5, item: objs.shortbow2
        },
        {
            level: 5, item: objs.ogre_arrow // after quest
        },
        {
            level: 9, item: objs.bolt
        },
        {
            level: 10, item: objs.longbow2
        },
        {
            level: 11, item: objs.opal_bolt
        },
        {
            level: 15, item: objs.iron_arrow
        },
        {
            level: 20, item: objs.oak_shortbow2
        },
        {
            level: 22, item: objs.iron_dart
        },
        {
            level: 25, item: objs.oak_longbow2
        },
        {
            level: 30, item: objs.steel_arrow
        },
        {
            level: 35, item: objs.willow_shortbow2
        },
        {
            level: 37, item: objs.steel_dart
        },
        {
            level: 40, item: objs.willow_longbow2
        },
        {
            level: 41, item: objs.pearl_bolt
        },
        {
            level: 45, item: objs.mithril_arrow
        },
        {
            level: 50, item: objs.maple_shortbow2
        },
        {
            level: 51, item: objs.barbed_bolt
        },
        {
            level: 52, item: objs.mithril_dart
        },
        {
            level: 55, item: objs.maple_longbow2
        },
        {
            level: 60, item: objs.adamant_arrow
        },
        {
            level: 65, item: objs.yew_shortbow2
        },
        {
            level: 67, item: objs.adamant_dart
        },
        {
            level: 70, item: objs.yew_longbow2
        },
        {
            level: 75, item: objs.rune_arrow
        },
        {
            level: 80, item: objs.magic_shortbow2
        },
        {
            level: 81, item: objs.rune_dart
        },
        {
            level: 85, item: objs.magic_longbow2
        },
    ],
    [Skills.FISHING]: [],
    [Skills.FIREMAKING]: [],
    [Skills.CRAFTING]: [
        // {
        //     level: 1, item: objs.leather_gloves
        // },
        // {
        //     level: 1, item: objs.wool
        // },
        // {
        //     level: 1, item: objs.beer_glass
        // },
        // {
        //     level: 1, item: objs.pot
        // },
        // {
        //     level: 1, item: objs.opal
        // },
        // {
        //     level: 4, item: objs.vial1
        // },
        // {
        //     level: 5, item: objs.gold_ring
        // },
        // {
        //     level: 6, item: objs.gold_necklace
        // },
        // {
        //     level: 7, item: objs.leather_boots
        // },
        // {
        //     level: 7, item: objs.pie_dish
        // },
        // {
        //     level: 8, item: objs.bowl
        // },
        // {
        //     level: 8, item: objs.gold_amulet2
        // },
        // {
        //     level: 9, item: objs.leather_cowl
        // },
        // {
        //     level: 10, item: objs.bow_string
        // },
        // {
        //     level: 11, item: objs.leather_vambraces
        // },
        // {
        //     level: 13, item: objs.jade
        // },
        // {
        //     level: 14, item: objs.leather_body
        // },
        // {
        //     level: 16, item: objs.holy_symbol
        // },
        // {
        //     level: 16, item: objs.red_topaz
        // },
        // {
        //     level: 17, item: objs.unholy_symbol
        // },
        // {
        //     level: 18, item: objs.leather_chaps
        // },
        // {
        //     level: 20, item: objs.sapphire
        // },
        // {
        //     level: 20, item: objs.sapphire_ring1
        // },
        // {
        //     level: 22, item: objs.sapphire_necklace1
        // },
        // {
        //     level: 24, item: objs.sapphire_amulet3
        // },
        // {
        //     level: 27, item: objs.emerald
        // },
        // {
        //     level: 27, item: objs.emerald_ring1
        // },
        // {
        //     level: 28, item: objs.hardleather_body
        // },
        // {
        //     level: 29, item: objs.emerald_necklace1
        // },
        // {
        //     level: 31, item: objs.emerald_amulet3
        // },
        // {
        //     level: 34, item: objs.ruby
        // },
        // {
        //     level: 34, item: objs.ruby_ring1
        // },
        // {
        //     level: 38, item: objs.coif
        // },
        // {
        //     level: 40, item: objs.ruby_necklace1
        // },
        // {
        //     level: 41, item: objs.studded_body
        // },
        // {
        //     level: 43, item: objs.diamond
        // },
        // {
        //     level: 43, item: objs.diamond_ring1
        // },
        // {
        //     level: 44, item: objs.studded_chaps
        // },
        // {
        //     level: 46, item: objs.unpowered_orb
        // },
        // {
        //     level: 50, item: objs.ruby_amulet3
        // },
        // {
        //     level: 54, item: objs.water_battlestaff
        // },
        // {
        //     level: 55, item: objs.dragonstone
        // },
        // {
        //     level: 55, item: objs.dragonstone_ring1
        // },
        // {
        //     level: 56, item: objs.diamond_necklace1
        // },
        // {
        //     level: 57, item: objs.dragon_vambraces1
        // },
        // {
        //     level: 58, item: objs.earth_battlestaff
        // },
        // {
        //     level: 60, item: objs.dragonhide_chaps1
        // },
        // {
        //     level: 62, item: objs.fire_battlestaff
        // },
        // {
        //     level: 63, item: objs.dragonhide_body1
        // },
        // {
        //     level: 66, item: objs.air_battlestaff
        // },
        // {
        //     level: 66, item: objs.dragon_vambraces2
        // },
        // {
        //     level: 68, item: objs.dragonhide_chaps2
        // },
        // {
        //     level: 70, item: objs.diamond_amulet3
        // },
        // {
        //     level: 71, item: objs.dragonhide_body2
        // },
        // {
        //     level: 72, item: objs.dragon_necklace1
        // },
        // {
        //     level: 73, item: objs.dragon_vambraces3
        // },
        // {
        //     level: 75, item: objs.dragonhide_chaps3
        // },
        // {
        //     level: 77, item: objs.dragonhide_body3
        // },
        // {
        //     level: 79, item: objs.dragon_vambraces4
        // },
        // {
        //     level: 80, item: objs.dragonstoneamulet3
        // },
        // {
        //     level: 82, item: objs.dragonhide_chaps4
        // },
        // {
        //     level: 84, item: objs.dragonhide_body4
        // },
    ],
    [Skills.SMITHING]: [],
    [Skills.MINING]: [],
    [Skills.HERBLORE]: [],
    [Skills.AGILITY]: [],
    [Skills.THIEVING]: [],
    [Skills.RUNECRAFT]: [],
};

export class Player {
    static APPEARANCE = 0x1;
    static ANIM = 0x2;
    static FACE_ENTITY = 0x4;
    static FORCED_CHAT = 0x8;
    static DAMAGE = 0x10;
    static FACE_COORD = 0x20;
    static CHAT = 0x40;
    static SPOTANIM = 0x100;
    static FORCED_MOVEMENT = 0x200;

    client;
    // netIn = [];
    netOut = [];

    uid = 0;
    username = '';

    combatLevel = 3;
    levels = [1, 1, 1, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    tempLevels = [1, 1, 1, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    exp = [0, 0, 0, 1154, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    lastChoice = -1;
    lastInt = -1;
    resumed = false;

    updateStat(stat) {
        if (stat > 20 || stat < 0) {
            return;
        }

        let buffer = new Packet();
        buffer.p1(ServerProtOpcodeFromID[ServerProt.UPDATE_STAT]);

        buffer.p1(stat);
        buffer.p4(Math.floor(this.exp[stat])); // level is calculated on the client by xp
        buffer.p1(this.tempLevels[stat]);

        this.netOut.push(buffer);

        if (this.getCombatLevel() != this.combatLevel) {
            this.combatLevel = this.getCombatLevel();
            this.generateAppearance();
        }
    }

    addExperience(stat, exp) {
        if (stat > 20 || stat < 0) {
            return;
        }

        this.exp[stat] += exp;
        if (this.exp[stat] > 200000000) {
            this.exp[stat] = 200000000; // cap at 200m
        }

        // update level if needed
        let level = getLevelByExp(this.exp[stat]);
        if (level > this.levels[stat]) {
            this.levels[stat] = level;
            this.tempLevels[stat] = level;

            if (stat == Skills.THIEVING) {
                this.showThievingLevelUp();
            } else if (stat == Skills.RUNECRAFT) {
                this.showRunecraftLevelUp();
            } else if (stat == Skills.WOODCUTTING) {
                this.showWoodcuttingLevelUp();
            } else if (stat == Skills.AGILITY) {
                this.showAgilityLevelUp();
            } else if (stat == Skills.FIREMAKING) {
                this.showFiremakingLevelUp();
            } else if (stat == Skills.MINING) {
                this.showMiningLevelUp();
            } else if (stat == Skills.RANGED) {
                this.showRangedLevelUp();
            } else if (stat == Skills.STRENGTH) {
                this.showStrengthLevelUp();
            } else if (stat == Skills.MAGIC) {
                this.showMagicLevelUp();
            } else if (stat == Skills.HITPOINTS) {
                this.showHitpointsLevelUp();
            } else if (stat == Skills.SMITHING) {
                this.showSmithingLevelUp();
            } else if (stat == Skills.COOKING) {
                this.showCookingLevelUp();
            } else if (stat == Skills.FLETCHING) {
                this.showFletchingLevelUp();
            } else if (stat == Skills.HERBLORE) {
                this.showHerbloreLevelUp();
            } else if (stat == Skills.PRAYER) {
                this.showPrayerLevelUp();
            } else if (stat == Skills.ATTACK) {
                this.showAttackLevelUp();
            } else if (stat == Skills.DEFENCE) {
                this.showDefenceLevelUp();
            } else if (stat == Skills.FISHING) {
                this.showFishingLevelUp();
            } else if (stat == Skills.CRAFTING) {
                this.showCraftingLevelUp();
            }
        }

        this.updateStat(stat);
    }

    setLevel(stat, level) {
        if (stat > 20 || stat < 0 || level > 99 || level < 0) {
            return;
        }

        this.levels[stat] = level;
        this.tempLevels[stat] = level;
        this.exp[stat] = getExpByLevel(level);

        this.updateStat(stat);
    }

    getLevel(stat) {
        return this.levels[stat];
    }

    getEffectiveLevel(stat) {
        return this.tempLevels[stat];
    }

    getCombatLevel() {
        let base = 0.25 * (this.levels[Skills.DEFENCE] + this.levels[Skills.HITPOINTS] + Math.floor(this.levels[Skills.PRAYER] / 2));
        let melee = 0.325 * (this.levels[Skills.ATTACK] + this.levels[Skills.STRENGTH]);
        let range = 0.325 * (Math.floor(this.levels[Skills.RANGED] / 2) + this.levels[Skills.RANGED]);
        let magic = 0.325 * (Math.floor(this.levels[Skills.MAGIC] / 2) + this.levels[Skills.MAGIC]);
        return Math.floor(base + Math.max(melee, range, magic));
    }

    getSkill(skill) {
        return this.skills[skill];
    }

    x = 3222;
    z = 3222;
    plane = 0;

    lastX = -1;
    lastZ = -1;
    lastPlane = 0;

    placement = true;
    mask = 0;
    faceDir = -1;
    walkDir = -1;
    runDir = -1;
    justFinishedMoving = false;
    steps = [];
    step = -1;
    loading = false;
    loaded = false;
    firstLoad = true;
    firstLogin = true;
    reconnecting = false;
    running = false;
    tempRunning = false;
    messageColor = 0;
    messageEffect = 0;
    messageType = 1;
    message = new Uint8Array();
    faceEntity = -1;
    faceX = -1;
    faceZ = -1;

    // observed entities
    players = [];
    npcs = [];
    objs = [];

    // queue
    delay = 0;
    queue = [];
    weakQueue = [];
    // interactions
    modalOpen = false;
    apScript = null;
    opScript = null;
    currentApRange = 10;
    apRangeCalled = false;
    target = null;
    persistent = false;
    // interface interactions
    interfaceScript = null; // only one script can be paused at a time

    resetInteraction() {
        this.apScript = null;
        this.opScript = null;
        this.currentApRange = 10;
        this.apRangeCalled = false;
        this.target = null;
        this.persistent = false;

        // unset target entity
        this.mask |= Player.FACE_ENTITY;
        this.faceEntity = -1;
    }

    delayed() {
        return this.delay > 0;
    }

    containsModalInterface() {
        return this.modalOpen;
    }

    // check if the player is in melee distance and has line of walk
    inOperableDistance() {
        let dx = Math.abs(this.x - this.target.x);
        let dz = Math.abs(this.z - this.target.z);

        if (dx > 1 || dz > 1) {
            // out of range
            return false;
        } else if (dx == 1 && dz == 1) {
            // diagonal
            return false;
        } else if (dx == 0 && dz == 0) {
            // same tile
            return true;
        } else if (dx == 1 && dz == 0) {
            // west/east
            return true;
        } else if (dx == 0 && dz == 1) {
            // north/south
            return true;
        }

        return false;
    }

    // check if the player is in range of the target and has line of sight
    inApproachDistance() {
        let dx = Math.abs(this.x - this.target.x);
        let dz = Math.abs(this.z - this.target.z);

        // TODO: check line of sight!
        if (dx <= this.currentApRange && dz <= this.currentApRange) {
            return true;
        } else {
            return false;
        }
    }

    // TODO: check if there's really steps to the target
    hasSteps() {
        return this.steps.length > 0;
    }

    process() {
        // updating first so opening interfaces won't flash with items
        new InventoryUpdate().execute(this);

        // queue
        this.queue = this.queue.filter(s => s); // remove any null scripts
        if (this.queue.find(s => s.type === 'strong')) {
            // the presence of a strong script closes modals before anything runs regardless of the order
            this.closeModal();
        }

        if (this.delayed()) {
            this.delay--;
        }

        if (!this.delayed()) {
            if (this.queue.find(s => s.type == 'strong')) {
                // remove weak scripts from the queue if a strong script is present
                this.weakQueue = [];
            }

            while (this.queue.length) {
                let processedQueueCount = this.processQueue();

                if (processedQueueCount == 0) {
                    break;
                }
            }
        }

        if (!this.delayed()) {
            while (this.weakQueue.length) {
                let processedQueueCount = this.processWeakQueue();

                if (processedQueueCount == 0) {
                    break;
                }
            }
        }

        // interactions
        if (this.target != null) {
            this.processInteractions();
        } else {
            new PlayerMovement().execute(this);
        }
    }

    processQueue() {
        let processedQueueCount = 0;

        // execute and remove scripts from the queue
        this.queue = this.queue.filter(s => {
            if (s.type == 'strong') {
                // strong scripts always close the modal
                this.closeModal();
            }

            if (!this.delayed() && !this.containsModalInterface() && !s.future()) {
                let finished = s.execute();
                processedQueueCount++;
                return !finished;
            } else if (!s.future()) {
                return false;
            }

            return true;
        });

        return processedQueueCount;
    }

    processWeakQueue() {
        let processedQueueCount = 0;

        // execute and remove scripts from the queue
        this.weakQueue = this.weakQueue.filter(s => {
            if (!this.delayed() && !this.containsModalInterface() && !s.future()) {
                let finished = s.execute();
                processedQueueCount++;
                return !finished;
            } else if (!s.future()) {
                return false;
            }

            return true;
        });

        return processedQueueCount;
    }

    processInteractions() {
        let interacted = false;
        this.apRangeCalled = false;

        if (!this.delayed() && !this.containsModalInterface()) {
            if (this.opScript != null && this.inOperableDistance()) {
                this.persistent = !this.opScript.execute();
                interacted = true;
            } else if (this.apScript != null && this.inApproachDistance()) {
                this.persistent = !this.apScript.execute();
                interacted = true;
            } else if (this.inOperableDistance()) {
                this.sendMessage('Nothing interesting happens.');
                interacted = true;
            }
        }

        new PlayerMovement().execute(this);
        let moved = this.walkDir != -1;

        // convert AP to OP if the player is in range
        if (this.apScript != null && this.currentApRange == -1) {
            this.opScript = this.apScript;
            this.apScript = null;
        }

        // re-check interactions after movement (ap can turn into op)
        if (!this.delayed() && !this.containsModalInterface()) {
            if (!interacted || this.apRangeCalled) {
                if (this.opScript != null && this.inOperableDistance() && !moved) {
                    this.persistent = !this.opScript.execute();
                    interacted = true;
                } else if (this.apScript != null && this.inApproachDistance()) {
                    this.apRangeCalled = false;
                    this.persistent = !this.apScript.execute();
                    interacted = true;
                } else if (this.inOperableDistance() && !moved) {
                    this.sendMessage('Nothing interesting happens.');
                    interacted = true;
                }
            }
        }

        if (!this.delayed() && !this.containsModalInterface()) {
            if (!interacted && !moved && !this.hasSteps()) {
                this.sendMessage("I can't reach that!");
                this.resetInteraction();
            }

            if (interacted && !this.apRangeCalled && !this.persistent) {
                this.resetInteraction();
            }
        }
    }

    gender = 0;
    body = [
        -1, // helmet
        -1, // cape
        -1, // amulet
        -1, // weapon
        18, // chest
        -1, // shield
        26, // arms
        36, // legs
        0, // head
        33, // hands
        42, // feet
        10 // beard
    ];
    colors = [
        0,
        0,
        0,
        0,
        0
    ];
    headicons = 0;
    appearance = null;

    lastSongX = -1;
    lastSongZ = -1;
    lastSong = '';

    animId = -1;
    animDelay = -1;
    varps = new Uint32Array(2000);

    inv = new Container(28);
    bank = new Container(400, Container.ALWAYS_STACK);
    bankOpen = false;
    withdrawCert = false;

    worn = new Container(11);
    weight = 0;
    bonuses = {
        astab: 0,
        aslash: 0,
        acrush: 0,
        amagic: 0,
        arange: 0,

        dstab: 0,
        dslash: 0,
        dcrush: 0,
        dmagic: 0,
        drange: 0,

        str: 0,
        rstr: 0, // not displayed
        mdmg: 0, // not displayed
        prayer: 0
    };

    autoplay = true;

    updateBonuses() {
        let equipTabStats = Component.get(1668);

        for (let i = 0; i < equipTabStats.children.length; ++i) {
            let stat = Component.get(equipTabStats.children[i]);
            if (stat.type !== 4) { // not text
                continue;
            }

            if (stat.color !== 7040819) { // not a stat
                continue;
            }

            let value = 0;
            if (i === 3) {
                value = this.bonuses.astab;
            } else if (i === 4) {
                value = this.bonuses.aslash;
            } else if (i === 5) {
                value = this.bonuses.acrush;
            } else if (i === 6) {
                value = this.bonuses.amagic;
            } else if (i === 7) {
                value = this.bonuses.arange;
            } else if (i === 8) {
                value = this.bonuses.dstab;
            } else if (i === 9) {
                value = this.bonuses.dslash;
            } else if (i === 10) {
                value = this.bonuses.dcrush;
            } else if (i === 11) {
                value = this.bonuses.dmagic;
            } else if (i === 12) {
                value = this.bonuses.drange;
            } else if (i === 14) {
                value = this.bonuses.str;
            } else if (i === 15) {
                value = this.bonuses.prayer;
            }

            if (value >= 0) {
                value = '+' + value;
            }

            this.setInterfaceText(stat.id, stat.text.split(':')[0] + ': ' + value);
        }
    }

    playMusic(name, showName = false, displayName = '') {
        let data = Packet.fromFile(`data/songs/${name}.mid`);

        let buffer = new Packet();
        buffer.p1(ServerProtOpcodeFromID[ServerProt.MIDI_SONG]);
        buffer.p1(0);

        let start = buffer.pos;
        buffer.pjstr(name);
        buffer.p4(Packet.crc32(data));
        buffer.p4(data.length);

        buffer.psize1 (buffer.pos - start);
        this.netOut.push(buffer);

        if (showName) {
            this.setInterfaceText(4439, !displayName ? properCase(name.replaceAll('_', ' ')) : displayName);
        }
    }

    sendVarp(id, value) {
        let buffer = new Packet();
        buffer.p1(ServerProtOpcodeFromID[ServerProt.VARP_SMALL]);

        buffer.p2(id);
        buffer.p1(value);

        this.netOut.push(buffer);
    }

    sendVarpLarge(id, value) {
        let buffer = new Packet();
        buffer.p1(ServerProtOpcodeFromID[ServerProt.VARP_LARGE]);

        buffer.p2(id);
        buffer.p4(value);

        this.netOut.push(buffer);
    }

    getVarpBit(id, bit) {
        return (this.varps[id] >> bit) & 1;
    }

    setVarpBit(id, bit) {
        this.varps[id] |= 1 << bit;
        this.sendVarpLarge(id, this.varps[id]);
    }

    setVarp(id, value, send = true) {
        if (this.varps[id] == value) {
            return;
        }

        this.varps[id] = value;

        if (send) {
            if (value > 255) {
                this.sendVarpLarge(id, value);
            } else {
                this.sendVarp(id, value);
            }
        }
    }

    openBank() {
        this.bankOpen = true;
        this.bank.update = true;
        this.inv.update = true;

        // 5292 - bank
        // 5063 - sidebar
        this.openSubInterface(5292, 5063);
    }

    closeBank() {
        this.bank.shift();
        this.bankOpen = false;
        this.inv.update = true;
    }

    sendFullInventory(interfaceId, inventory = this.inv, updateAmount = -1) {
        if (!interfaceId && this.bankOpen) {
            interfaceId = 3214;
        } else if (!interfaceId) {
            interfaceId = 5064;
        }

        if (updateAmount == -1) {
            updateAmount = inventory.capacity;
        }

        let buffer = new Packet();
        buffer.p1(ServerProtOpcodeFromID[ServerProt.UPDATE_INV_FULL]);
        buffer.p2(0);
        let start = buffer.pos;

        buffer.p2(interfaceId);
        buffer.p1(updateAmount);
        for (let i = 0; i < updateAmount; i++) {
            const item = inventory.items[i];
            let id = -1;
            let count = 0;

            if (item) {
                id = item.id;
                count = item.count;
            }

            buffer.p2(id + 1);
            if (count > 254) {
                buffer.p1(255);
                buffer.p4(count);
            } else {
                buffer.p1(count);
            }
        }

        buffer.psize2(buffer.pos - start);
        this.netOut.push(buffer);
        inventory.update = false;
    }

    addItem(id, inventory = this.inv, count = 1, slot = -1) {
        if (typeof id === 'undefined' || id == -1) {
            return;
        }

        inventory.add(id, count, slot, false);
    }

    dropItem(slot, id) {
        if (!this.inv.hasAt(slot, id)) {
            return;
        }

        let item = this.inv.get(slot);
        this.inv.delete(slot);

        World.addGroundObj(item, this.x, this.z, this.plane, this.pid);
    }

    clearinv() {
        for (let i = 0; i < this.inv.capacity; i++) {
            this.inv.items[i] = null;
        }
        this.inv.update = true;
    }

    clearBank() {
        for (let i = 0; i < this.bank.capacity; i++) {
            this.bank.items[i] = null;
        }
        this.bank.update = true;
    }

    ready = false;
    lowmem = false;
    webclient = false;

    constructor(client, reconnecting, username, lowmem, webclient, hasData) {
        this.reconnecting = reconnecting;
        this.client = client;
        this.client.player = this;
        this.lowmem = lowmem;
        this.webclient = webclient;

        this.username = titleCase(username);
        this.username37 = toBase37(this.username);

        if (!hasData) {
            this.generateAppearance();
            this.ready = true;
        }
    }

    setInteraction(trigger, on, params) {
        if (this.delay > 0) {
            return;
        }

        this.target = { x: params.x, z: params.z };
        this.persistent = false;

        if (trigger.indexOf('LOC') !== -1) {
            this.target.type = 'loc';

            this.faceX = (this.target.x) * 2 + 1;
            this.faceZ = (this.target.z) * 2 + 1;
            this.alreadyFaced = false;
        } else if (trigger.indexOf('OBJ') !== -1) {
            this.target.type = 'obj';

            this.faceX = (this.target.x) * 2 + 1;
            this.faceZ = (this.target.z) * 2 + 1;
            this.alreadyFaced = false;
        } else if (trigger.indexOf('PLAYER') !== -1) {
            this.target.type = 'player';
            this.target.index = params.playerIndex;

            this.mask |= Player.FACE_ENTITY;
            this.faceEntity = this.target.index + 32768;
        } else if (trigger.indexOf('NPC') !== -1) {
            this.target.type = 'npc';
            this.target.index = params.npcIndex;

            // console.log(params.npcId);
            this.mask |= Player.FACE_ENTITY;
            this.faceEntity = this.target.index;
        }

        // try to get approachable scripts first since they can set aprange(-1) and turn into operable scripts
        let script = ScriptManager.get(this, trigger.replace('OP', 'AP'), on, params);
        if (script) {
            this.apScript = script;
        } else {
            this.opScript = ScriptManager.get(this, trigger, on, params);
        }

        // close any pending interface scripts
        this.closeModal();
    }

    decodeIn() {
        let offset = 0;

        let decoded = [];
        while (offset < this.client.inOffset) {
            const opcode = this.client.in[offset++];

            let length = ClientProtSize[opcode];
            if (length == -1) {
                length = this.client.in[offset++];
            } else if (length == -2) {
                length = this.client.in[offset++] << 8 | this.client.in[offset++];
            }

            decoded.push({
                id: ClientProtOpcode[opcode],
                data: new Packet(this.client.in.subarray(offset, offset + length))
            });
            offset += length;
        }

        // only process the last of these packet types per tick
        const DEDUPE_PACKETS = [
            ClientProt.OPLOC1, ClientProt.OPLOC2, ClientProt.OPLOC3, ClientProt.OPLOC4, ClientProt.OPLOC5, ClientProt.OPLOCT, ClientProt.OPLOCU,
        ];

        for (let i = 0; i < decoded.length; i++) {
            const { id, data } = decoded[i];

            if (DEDUPE_PACKETS.indexOf(id) !== -1 && decoded.findIndex((d, index) => index > i && d.id == id) !== -1) {
                continue;
            }

            if (id == ClientProt.MAP_REQUEST_AREAS) {
                let requested = [];
                for (let i = 0; i < data.length / 3; i++) {
                    let type = data.g1();
                    let x = data.g1();
                    let z = data.g1();

                    requested.push({ type, x, z });
                }

                for (let i = 0; i < requested.length; i++) {
                    const { type, x, z } = requested[i];

                    const CHUNK_SIZE = 5000 - 1 - 2 - 1 - 1 - 2 - 2;
                    if (type == 0) {
                        let land = Packet.fromFile(`data/maps/m${x}_${z}`);

                        for (let off = 0; off < land.length; off += CHUNK_SIZE) {
                            let packet = new Packet();

                            packet.p1(ServerProtOpcodeFromID[ServerProt.DATA_LAND]);
                            packet.p2(0);
                            let start = packet.pos;
                            packet.p1(x);
                            packet.p1(z);
                            packet.p2(off);
                            packet.p2(land.length);
                            packet.pdata(land.gdata(CHUNK_SIZE));
                            packet.psize2(packet.pos - start);
                            this.netOut.push(packet);
                        }

                        let packet = new Packet();
                        packet.p1(ServerProtOpcodeFromID[ServerProt.DATA_LAND_DONE]);
                        packet.p1(x);
                        packet.p1(z);
                        this.netOut.push(packet);
                    } else if (type == 1) {
                        let loc = Packet.fromFile(`data/maps/l${x}_${z}`);

                        for (let off = 0; off < loc.length; off += CHUNK_SIZE) {
                            let packet = new Packet();

                            packet.p1(ServerProtOpcodeFromID[ServerProt.DATA_LOC]);
                            packet.p2(0);
                            let start = packet.pos;
                            packet.p1(x);
                            packet.p1(z);
                            packet.p2(off);
                            packet.p2(loc.length);
                            packet.pdata(loc.gdata(CHUNK_SIZE));
                            packet.psize2(packet.pos - start);
                            this.netOut.push(packet);
                        }

                        let packet = new Packet();
                        packet.p1(ServerProtOpcodeFromID[ServerProt.DATA_LOC_DONE]);
                        packet.p1(x);
                        packet.p1(z);
                        this.netOut.push(packet);
                    }
                }

                this.loaded = true;
                this.loading = false;
            } else if (id == ClientProt.CLIENT_CHEAT) {
                let command = data.gjstr().toLowerCase();
                let args = command.split(' ');
                command = args.shift();

                switch (command) {
                    case 'help':
                        this.sendMessage('Available commands: tele, region, anim, gfx, sound, inter, chat, settext, close, pos, npc, item, clear, clearbank, bank, herbtest, max, min, setlevel, banktest');
                        break;
                    case 'invdump':
                        console.log(this.bank, this.worn, this.inv);
                        break;
                    case 'tile': {
                        let offX = 0;
                        let offZ = 0;
                        if (args[0]) {
                            offX = parseInt(args[0]);
                        }
                        if (args[1]) {
                            offZ = parseInt(args[1]);
                        }
                        this.sendMessage(SceneBuilder.collision[this.plane].get(this.x + offX, this.z + offZ).toString(16));
                    } break;
                    case 'canmove': {
                        let offX = 0;
                        let offZ = 0;
                        if (args[0]) {
                            offX = parseInt(args[0]);
                        }
                        if (args[1]) {
                            offZ = parseInt(args[1]);
                        }
                        this.sendMessage(SceneBuilder.canMoveTo(this.x, this.z, this.x + offX, this.z + offZ, this.plane).toString());
                    } break;
                    case 'home':
                        this.x = 3222;
                        this.z = 3222;
                        this.plane = 0;
                        this.teleport();
                        break;
                    case 'tele':
                        if (args.length < 2) {
                            this.sendMessage('Usage: tele <x> <z> [plane]');
                            break;
                        }

                        this.x = parseInt(args[0]);
                        this.z = parseInt(args[1]);
                        if (args[2]) {
                            this.plane = parseInt(args[2]);
                        }
                        this.teleport();
                        break;
                    case 'jtele':
                        if (args.length < 1 || args[0].indexOf('_') == -1) {
                            this.sendMessage('Usage: jtele plane_fx_fz_dx_dz');
                            break;
                        }

                        let parts = args[0].split('_').map((p) => parseInt(p));
                        this.plane = parseInt(parts[0]);
                        this.x = parseInt(parts[1]) * 64 + parseInt(parts[3]);
                        this.z = parseInt(parts[2]) * 64 + parseInt(parts[4]);
                        this.teleport();
                        break;
                    case 'region':
                        if (args.length < 2) {
                            this.sendMessage('Usage: region <x> <z> [plane]');
                            break;
                        }

                        this.x = (parseInt(args[0]) << 6) + 32;
                        this.z = (parseInt(args[1]) << 6) + 32;
                        if (args[2]) {
                            this.plane = parseInt(args[2]);
                        }
                        this.teleport();
                        break;
                    case 'anim':
                        if (args.length < 1) {
                            this.sendMessage('Usage: anim <id/name> [delay]');
                            break;
                        }

                        this.playAnimation(isNaN(args[0]) ? args[0] : parseInt(args[0]), args[1] ? parseInt(args[1]) : 0);
                        break;
                    case 'gfx':
                        if (args.length < 1) {
                            this.sendMessage('Usage: gfx <id/name> [delay] [height]');
                            break;
                        }

                        this.playGraphic(isNaN(args[0]) ? args[0] : parseInt(args[0]), args[1] ? parseInt(args[1]) : 0, args[2] ? parseInt(args[2]) : 0);
                        break;
                    case 'sound':
                        if (args.length < 1) {
                            this.sendMessage('Usage: sound <id/name> [loops] [delay]');
                            break;
                        }

                        this.playSound(isNaN(args[0]) ? args[0] : parseInt(args[0]), args[1] ? parseInt(args[1]) : 0, args[2] ? parseInt(args[2]) : 0);
                        break;
                    case 'inter':
                        if (args.length < 1) {
                            this.sendMessage('Usage: inter <id>');
                            break;
                        }

                        this.openInterface(parseInt(args[0]));
                        break;
                    case 'chat':
                        if (args.length < 1) {
                            this.sendMessage('Usage: chat <id>');
                            break;
                        }

                        this.openChatboxInterface(parseInt(args[0]));
                        break;
                    case 'settext':
                        if (args.length < 1) {
                            this.sendMessage('Usage: text <id> <text>');
                            break;
                        }

                        this.setInterfaceText(parseInt(args[0]), args.slice(1).join(' '));
                        break;
                    case 'close':
                        this.closeModal();
                        break;
                    case 'pos':
                        this.sendMessage(`Current pos: ${this.x}, ${this.z}, ${this.plane} (${this.x >> 6}, ${this.z >> 6}) (${this.plane}_${Position.file(this.x)}_${Position.file(this.z)}_${Position.localOrigin(this.x)}_${Position.localOrigin(this.z)})`);
                        break;
                    case 'npc': {
                        if (args.length < 1) {
                            this.sendMessage('Usage: npc <id>');
                            return;
                        }

                        let type;
                        if (!isNaN(args[0])) {
                            type = NpcType.get(parseInt(args[0]));
                        } else {
                            type = NpcType.getByName(args[0]);
                        }

                        if (!type) {
                            return;
                        }

                        let nid = World.nids.indexOf(true);
                        let npc = {
                            nid,
                            id: type.id,
                            x: this.x,
                            z: this.z,
                            plane: this.plane,
                            dir: -1,
                            startX: this.x,
                            startZ: this.z,
                            startPlane: this.plane,
                            startDir: -1,
                            step: -1,
                            steps: [],
                            wander: 5,
                        };
                        World.npcs[nid] = npc;
                        World.nids[nid] = false;
                        this.sendMessage(`Spawned NPC ${type.name} at ${this.x}, ${this.z}, ${this.plane}`);
                    } break;
                    case 'item': {
                        if (args.length < 1) {
                            this.sendMessage('Usage: item <id> (count)');
                            return;
                        }

                        let type;
                        if (!isNaN(args[0])) {
                            type = ObjectType.get(parseInt(args[0]));
                        } else {
                            type = ObjectType.getByName(args[0]);
                        }

                        if (!type) {
                            return;
                        }

                        let count = Number(args[1] ?? 1);
                        this.addItem(type.id, this.inv, count);
                        this.sendMessage(`Added ${type.name} x${count}`);
                    } break;
                    case 'clear': {
                        this.clearinv();
                    } break;
                    case 'clearbank': {
                        this.clearBank();
                    } break;
                    case 'bank': {
                        this.openBank();
                    } break;
                    case 'fletchtest':
                        this.inv.add(objs.knife);
                        this.inv.add(objs.logs1, 5);
                        this.inv.add(objs.oak_logs, 5);
                        this.inv.add(objs.bow_string, 5);
                        this.inv.add(objs.feather, 100);
                        this.inv.add(objs.bronze_arrowtips, 100);
                        break;
                    case 'herbtest':
                        // attack potion
                        this.inv.add(227); // vial of water
                        this.inv.add(199); // dirty guam leaf
                        this.inv.add(221); // eye of newt

                        this.inv.add(227); // vial of water (extra)

                        // identify
                        this.inv.add(201);
                        this.inv.add(203);
                        this.inv.add(205);
                        this.inv.add(207);

                        // grind
                        this.inv.add(233);
                        this.inv.add(237);
                        this.inv.add(243);
                        this.inv.add(1973);
                        break;
                    case 'max':
                        for (let i = 0; i < this.levels.length; i++) {
                            this.setLevel(i, 99);
                        }
                        break;
                    case 'min':
                        for (let i = 0; i < this.levels.length; i++) {
                            let level = 1;
                            if (i == 3) {
                                level = 10;
                            }
                            this.setLevel(i, level);
                        }
                        break;
                    case 'setlevel':
                        if (args.length < 2) {
                            this.sendMessage('Usage: setlevel <skill> <level>');
                            return;
                        }

                        let skillNames = Object.keys(Skills).map(s => s.toLowerCase());
                        let skill = skillNames.indexOf(args[0].toLowerCase());
                        if (skill !== -1) {
                            this.setLevel(skill, parseInt(args[1]));
                        } else {
                            this.setLevel(parseInt(args[0]), parseInt(args[1]));
                        }
                        break;
                    case 'banktest':
                        this.bank.add(995, 1000000);
                        this.bank.add(objs.red_partyhat, 15);
                        this.bank.add(objs.yellow_partyhat, 15);
                        this.bank.add(objs.blue_partyhat, 15);
                        this.bank.add(objs.green_partyhat, 15);
                        this.bank.add(objs.purple_partyhat, 15);
                        this.bank.add(objs.white_partyhat, 15);
                        this.bank.add(objs.santa_hat, 15);
                        break;
                    case 'jingle':
                        this.playJingle(args.join(' '));
                        break;
                    case 'unlock':
                        this.unlockAllTracks();
                        break;
                    case 'chattest': {
                        this.showPlayerMessage(parseInt(args[0]), 'Test');
                    } break;
                    case 'test': {
                        if (!args[0]) {
                            args[0] = 'fletching';
                        }

                        let skillNames = Object.keys(Skills).map(s => s.toLowerCase());
                        let stat = skillNames.indexOf(args[0].toLowerCase());
                        if (stat == -1) {
                            stat = Skills.FLETCHING;
                        }

                        if (stat == Skills.THIEVING) {
                            this.showThievingLevelUp();
                        } else if (stat == Skills.RUNECRAFT) {
                            this.showRunecraftLevelUp();
                        } else if (stat == Skills.WOODCUTTING) {
                            this.showWoodcuttingLevelUp();
                        } else if (stat == Skills.AGILITY) {
                            this.showAgilityLevelUp();
                        } else if (stat == Skills.FIREMAKING) {
                            this.showFiremakingLevelUp();
                        } else if (stat == Skills.MINING) {
                            this.showMiningLevelUp();
                        } else if (stat == Skills.RANGED) {
                            this.showRangedLevelUp();
                        } else if (stat == Skills.STRENGTH) {
                            this.showStrengthLevelUp();
                        } else if (stat == Skills.MAGIC) {
                            this.showMagicLevelUp();
                        } else if (stat == Skills.HITPOINTS) {
                            this.showHitpointsLevelUp();
                        } else if (stat == Skills.SMITHING) {
                            this.showSmithingLevelUp();
                        } else if (stat == Skills.COOKING) {
                            this.showCookingLevelUp();
                        } else if (stat == Skills.FLETCHING) {
                            this.showFletchingLevelUp();
                        } else if (stat == Skills.HERBLORE) {
                            this.showHerbloreLevelUp();
                        } else if (stat == Skills.PRAYER) {
                            this.showPrayerLevelUp();
                        } else if (stat == Skills.ATTACK) {
                            this.showAttackLevelUp();
                        } else if (stat == Skills.DEFENCE) {
                            this.showDefenceLevelUp();
                        } else if (stat == Skills.FISHING) {
                            this.showFishingLevelUp();
                        } else if (stat == Skills.CRAFTING) {
                            this.showCraftingLevelUp();
                        }
                    } break;
                }
            } else if (id == ClientProt.MOVE_GAMECLICK || id == ClientProt.MOVE_MINIMAPCLICK || id == ClientProt.MOVE_OPCLICK) {
                let ctrlDown = data.g1() === 1;
                let startX = data.g2();
                let startZ = data.g2();

                let offset = 0;
                if (id == ClientProt.MOVE_MINIMAPCLICK) {
                    offset = 14;
                }
                let count = (data.available - offset) / 2;

                if (this.delay == 0) {
                    this.steps = [];
                    this.steps.push({ x: startX, z: startZ });
                    for (let i = 0; i < count; ++i) {
                        let x = data.g1b() + startX;
                        let z = data.g1b() + startZ;
                        this.steps.push({ x, z });
                    }
                    this.steps.reverse();
                    this.step = this.steps.length - 1;
                    this.resetInteraction();
                    this.closeModal();

                    if (ctrlDown) {
                        this.tempRunning = true;
                    } else {
                        this.tempRunning = false;
                    }
                } else {
                    this.clearWalkingQueue();
                }
            } else if (id == ClientProt.CLOSE_MODAL) {
                this.closeModal(false);
            } else if (id == ClientProt.IF_DESIGN) {
                this.gender = data.g1();

                let body = [];
                for (let i = 0; i < 7; i++) {
                    body[i] = data.g1();
                    if (body[i] == 255) {
                        body[i] = -1;
                    }
                }

                this.body[8] = body[0];
                this.body[11] = body[1];
                this.body[4] = body[2];
                this.body[6] = body[3];
                this.body[9] = body[4];
                this.body[7] = body[5];
                this.body[10] = body[6];

                for (let i = 0; i < 5; i++) {
                    this.colors[i] = data.g1();
                }

                this.generateAppearance();
            } else if (id == ClientProt.IF_BUTTON) {
                let buttonId = data.g2();

                // console.log(buttonId);
                this.executeInterface(ScriptManager.get(this, ClientProt[id], { buttonId }, { buttonId }));
            } else if (id == ClientProt.IF_BUTTOND) {
                let interfaceId = data.g2();
                let fromSlot = data.g2();
                let toSlot = data.g2();

                this.executeInterface(ScriptManager.get(this, ClientProt[id], { interfaceId }, { interfaceId, fromSlot, toSlot }));
            } else if (id == ClientProt.IF_BUTTON1 || id == ClientProt.IF_BUTTON2 || id == ClientProt.IF_BUTTON3 || id == ClientProt.IF_BUTTON4 || id == ClientProt.IF_BUTTON5) {
                let itemId = data.g2();
                let slot = data.g2();
                let interfaceId = data.g2();

                this.executeInterface(ScriptManager.get(this, ClientProt[id], { interfaceId }, { itemId, slot, interfaceId }));
            } else if (id == ClientProt.OPLOC1 || id == ClientProt.OPLOC2 || id == ClientProt.OPLOC3 || id == ClientProt.OPLOC4 || id == ClientProt.OPLOC5) {
                let x = data.g2();
                let z = data.g2();
                let locId = data.g2();

                this.setInteraction(ClientProt[id], { locId }, { locId, x, z });
            } else if (id == ClientProt.OPOBJ1 || id == ClientProt.OPOBJ2 || id == ClientProt.OPOBJ3 || id == ClientProt.OPOBJ4 || id == ClientProt.OPOBJ5) {
                let x = data.g2();
                let z = data.g2();
                let objId = data.g2();

                this.setInteraction(ClientProt[id], { objId }, { objId, x, z });
            } else if (id == ClientProt.OPPLAYER1 || id == ClientProt.OPPLAYER2 || id == ClientProt.OPPLAYER3 || id == ClientProt.OPPLAYER4) {
                let playerIndex = data.g2();
                let player = World.getPlayer(playerIndex);

                this.setInteraction(ClientProt[id], { playerIndex }, { playerId: playerIndex, x: player.x, z: player.z });
            } else if (id == ClientProt.OPNPC1 || id == ClientProt.OPNPC2 || id == ClientProt.OPNPC3 || id == ClientProt.OPNPC4 || id == ClientProt.OPNPC5) {
                let npcIndex = data.g2();
                let npc = World.npcs[npcIndex];

                this.setInteraction(ClientProt[id], { npcId: npc.id }, { npcId: npc.id, npcIndex, x: npc.x, z: npc.z, npc });
            } else if (id == ClientProt.OPHELD1 || id == ClientProt.OPHELD2 || id == ClientProt.OPHELD3 || id == ClientProt.OPHELD4 || id == ClientProt.OPHELD5) {
                let itemId = data.g2();
                let slot = data.g2();
                let interfaceId = data.g2();

                this.lastVerifyObj = itemId;
                this.lastSlot = slot;
                this.lastComSubId = interfaceId;

                this.closeModal();
                this.executeInterface(ScriptManager.get(this, ClientProt[id], { itemId }, { itemId, slot, interfaceId }));
            } else if (id == ClientProt.OPLOCU) {
                let x = data.g2();
                let z = data.g2();
                let locId = data.g2();
                let objId = data.g2();
                let slot = data.g2();
                let interfaceId = data.g2();

                this.lastUseSlot = slot;
                this.lastUseItem = objId;
                this.lastComSubId = interfaceId;
                this.setInteraction(ClientProt[id], { locId, objId }, { locId, objId, x, z, slot, interfaceId });
            } else if (id == ClientProt.OPNPCU) {
                let npcId = data.g2();
                let npc = World.npcs[npcId];
                let objId = data.g2();
                let slot = data.g2();
                let interfaceId = data.g2();

                this.lastUseSlot = slot;
                this.lastUseItem = objId;
                this.lastComSubId = interfaceId;
                this.setInteraction(ClientProt[id], { npcId: npc.id, objId }, { npcId: npc.id, objId, x: npc.x, z: npc.z, slot, interfaceId });
            } else if (id == ClientProt.OPHELDU) {
                let onItemId = data.g2();
                let onSlot = data.g2();
                let onInterfaceId = data.g2();
                let useItemId = data.g2();
                let useSlot = data.g2();
                let useInterfaceId = data.g2();

                this.closeModal();
                this.executeInterface(ScriptManager.get(this, ClientProt[id], { onItemId, useItemId }, { onItemId, onSlot, onInterfaceId, useItemId, useSlot, useInterfaceId }));
            } else if (id == ClientProt.RESUME_PAUSEBUTTON) {
                let interfaceId = data.g2();

                this.resumed = true;
                this.lastComSubId = interfaceId;
                this.resumeInterface(true);

                if (!this.interfaceScript && (this.opScript || this.apScript)) {
                    this.closeModal();
                }
            } else if (id == ClientProt.RESUME_P_COUNTDIALOG) {
                let count = data.g4();

                this.lastInt = count;
                this.resumeInterface();
            } else if (id == ClientProt.MESSAGE_PUBLIC) {
                this.messageColor = data.g1();
                this.messageEffect = data.g1();
                this.messageType = 0;
                this.message = data.gdata();
                this.mask |= Player.CHAT;
            }
        }
    }

    executeInterface(script) {
        if (script) {
            let state = script.execute();

            if (!state) {
                this.interfaceScript = script;
            }
        } else {
            this.sendMessage('Nothing interesting happens.');
        }
    }

    resumeInterface(close = false) {
        if (this.interfaceScript != null) {
            let done = this.interfaceScript.execute();

            if (done) {
                this.interfaceScript = null;

                if (close) {
                    this.closeModal();
                }
            }
        }
    }

    encodeOut() {
        for (let i = 0; i < this.netOut.length; i++) {
            let packet = this.netOut[i];

            if (process.env.VERBOSE) {
                console.log(this.client.remoteAddress, 'Sending', ServerProt[ServerProtOpcode[packet.data[0]]], packet.length, 'bytes');
            }

            if (this.client.encryptor) {
                packet.data[0] += this.client.encryptor.nextInt();
            }

            this.client.write(packet);
        }
    }

    isWithinDistance(entity) {
        let dx = Math.abs(this.x - entity.x);
        let dz = Math.abs(this.z - entity.z);

        return dz < 16 && dx < 16 && this.plane == entity.plane;
    }

    // TODO: limit to zones/use a quadtree
    getNearbyNpcs() {
        let npcs = [];

        for (let i = 0; i < World.npcs.length; i++) {
            if (World.npcs[i] == null) {
                continue;
            }

            let npc = World.npcs[i];

            if (this.isWithinDistance(npc)) {
                npcs.push(npc);
            }
        }

        return npcs;
    }

    getNearbyPlayers() {
        let players = [];

        for (let i = 0; i < World.players.length; i++) {
            if (World.players[i] == null) {
                continue;
            }

            let player = World.players[i];
            if (this == player || !player.ready) {
                continue;
            }

            if (this.isWithinDistance(player)) {
                players.push(player);
            }
        }

        return players;
    }

    generateAppearance() {
        let stream = new Packet();

        stream.p1(this.gender);
        stream.p1(this.headicons);

        for (let i = 0; i < this.body.length; i++) {
            let part = this.body[i];

            // let wearSlot = 0;
            // let equipment = this.worn.get(wearSlot);

            // if (equipment) {
            //     part = 0x200;
            //     part += equipment.id;
            //     console.log(part);
            // } else

            if (part != -1) {
                part |= 0x100;
            } else {
                part = 0;
            }

            if (part > 0xFF) {
                stream.p2(part);
            } else {
                stream.p1(part);
            }
        }

        for (let i = 0; i < this.colors.length; i++) {
            stream.p1(this.colors[i]);
        }

        stream.p2(0x328);
        stream.p2(0x337);
        stream.p2(0x333);
        stream.p2(0x334);
        stream.p2(0x335);
        stream.p2(0x336);
        stream.p2(0x338);

        stream.p8(this.username37);
        stream.p1(this.combatLevel);

        this.appearance = stream;
        this.mask |= Player.APPEARANCE;
    }

    teleport(x, z, plane, resetAnims = true) {
        if (typeof x !== 'undefined') {
            this.x = x;
        }

        if (typeof z !== 'undefined') {
            this.z = z;
        }

        if (typeof plane !== 'undefined') {
            this.plane = plane;
        }

        this.placement = true;

        this.clearWalkingQueue();
        this.resetInteraction();

        if (resetAnims) {
            this.resetAnimations();
        }
    }

    playAnimation(id, delay = 0) {
        if (typeof id === 'string') {
            id = AnimationNames.indexOf(id);
        }

        if (typeof id === 'undefined' || id == -1) {
            return;
        }

        this.animId = id;
        this.animDelay = delay;
        this.mask |= Player.ANIM;
    }

    playGraphic(id, height = 0, delay = 0) {
        if (typeof id === 'string') {
            id = GraphicNames.indexOf(id);
        }

        if (typeof id === 'undefined' || id == -1) {
            return;
        }

        this.graphicId = id;
        this.graphicHeight = height;
        this.graphicDelay = delay;
        this.mask |= Player.SPOTANIM;
    }

    // protocol

    playSound(id, loops = 0, delay = 0) {
        if (typeof id === 'string') {
            id = SoundNames.indexOf(id);
        }

        if (typeof id === 'undefined' || id == -1) {
            return;
        }

        let packet = new Packet();
        packet.p1(ServerProtOpcodeFromID[ServerProt.SYNTH_SOUND]);
        packet.p2(id);
        packet.p1(loops);
        packet.p2(delay);
        this.netOut.push(packet);
    }

    sendUid() {
        let packet = new Packet();
        packet.p1(ServerProtOpcodeFromID[ServerProt.UPDATE_UID192]);
        packet.p2(this.pid);
        this.netOut.push(packet);
    }

    playJingle(name, songDelay = 10000) {
        if (!fs.existsSync(`data/jingles/${name}.mid`)) {
            return;
        }

        // temporary workaround until delay is understood
        if (this.webclient) {
            songDelay = 6000;
        } else {
            songDelay = 10000;
        }

        let packet = new Packet();
        packet.p1(ServerProtOpcodeFromID[ServerProt.MIDI_JINGLE]);
        packet.p2(0);
        let start = packet.pos;

        packet.p2(songDelay);

        let data = fs.readFileSync(`data/jingles/${name}.mid`);
        packet.pdata(data);

        packet.psize2(packet.pos - start);
        this.netOut.push(packet);
    }

    unlockAllTracks() {
        let musicList = Component.get(Component.get(962).children[0]);

        let musicVariables = [];
        for (let i = 0; i < musicList.children.length; ++i) {
            let song = Component.get(musicList.children[i]);
            if (song.buttonType !== 1) {
                continue;
            }
            if (!song.script) {
                continue;
            }

            let opcode = song.script[0][0];
            if (opcode !== 13) {
                continue;
            }
            let index = song.script[0][1];
            if (musicVariables.indexOf(index) === -1) {
                musicVariables.push(index);
            }
            let mask = song.script[0][2];
            this.varps[index] |= 1 << mask;
        }

        for (let i = 0; i < musicVariables.length; ++i) {
            this.sendVarpLarge(musicVariables[i], this.varps[musicVariables[i]]);
        }
    }

    resetAnimations() {
        let packet = new Packet();
        packet.p1(ServerProtOpcodeFromID[ServerProt.RESET_ANIMS]);
        this.netOut.push(packet);
    }

    clearWalkingQueue() {
        let packet = new Packet();
        packet.p1(ServerProtOpcodeFromID[ServerProt.CLEAR_WALKING_QUEUE]);
        this.netOut.push(packet);

        this.steps = [];
        this.step = -1;
    }

    resetVarCache() {
        let packet = new Packet();
        packet.p1(ServerProtOpcodeFromID[ServerProt.RESET_CLIENT_VARCACHE]);
        this.netOut.push(packet);
    }

    showWelcome() {
        let packet = new Packet();
        packet.p1(ServerProtOpcodeFromID[ServerProt.LAST_LOGIN_INFO]);

        let lastLoginIp = this.lastLoginIp;
        if (!lastLoginIp) {
            lastLoginIp = '127.0.0.1';
        }

        let strToIp = function(str) {
            let parts = str.split('.');
            return (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
        };

        let lastLoginDate = this.lastLoginDate;
        if (!lastLoginDate) {
            lastLoginDate = Date.now();
        }
        let daysSinceLogin = Math.floor((Date.now() - lastLoginDate) / 86400000);

        packet.p4(strToIp(lastLoginIp)); // last ip
        packet.p2(daysSinceLogin); // days since login
        packet.p1(201); // days since recovery change
        packet.p2(0); // unread messages

        this.netOut.push(packet);

        this.welcomeOpen = true;
    }

    showAmountDialog() {
        let packet = new Packet();
        packet.p1(ServerProtOpcodeFromID[ServerProt.IF_IAMOUNT]);
        this.netOut.push(packet);

        this.modalOpen = true;
    }

    openInterface(interfaceId) {
        let packet = new Packet();
        packet.p1(ServerProtOpcodeFromID[ServerProt.IF_OPENTOP]);
        packet.p2(interfaceId);
        this.netOut.push(packet);

        this.modalOpen = true;
        this.clearWalkingQueue();

        if (this.interfaceScript != null) {
            this.interfaceScript = null;
        }
    }

    openSticky(interfaceId) {
        let buffer = new Packet();
        buffer.p1(ServerProtOpcodeFromID[ServerProt.IF_OPENSTICKY]);
        buffer.p2(interfaceId);
        this.netOut.push(buffer);
    }

    openSubInterface(topInterface, sideInterface) {
        let buffer = new Packet();
        buffer.p1(ServerProtOpcodeFromID[ServerProt.IF_OPENSUB]);
        buffer.p2(topInterface);
        buffer.p2(sideInterface);
        this.netOut.push(buffer);
    }

    openChatboxInterface(interfaceId) {
        let buffer = new Packet();
        buffer.p1(ServerProtOpcodeFromID[ServerProt.IF_OPENBOTTOM]);
        buffer.p2(interfaceId);
        this.netOut.push(buffer);

        // this.modalOpen = true;
        // if (this.interfaceScript != null) {
        //     this.interfaceScript = null;
        // }
    }

    setPlayerHead(interfaceId) {
        let buffer = new Packet();
        buffer.p1(ServerProtOpcodeFromID[ServerProt.IF_SETPLAYERHEAD]);
        buffer.p2(interfaceId);
        this.netOut.push(buffer);
    }

    setNpcHead(interfaceId, npcId) {
        let buffer = new Packet();
        buffer.p1(ServerProtOpcodeFromID[ServerProt.IF_SETNPCHEAD]);
        buffer.p2(interfaceId);
        buffer.p2(npcId);
        this.netOut.push(buffer);
    }

    setInterfaceAnimation(interfaceId, seqId) {
        if (typeof seqId === 'string') {
            seqId = AnimationNames.indexOf(seqId);
        }

        if (typeof seqId === 'undefined' || seqId == -1) {
            return;
        }

        let buffer = new Packet();
        buffer.p1(ServerProtOpcodeFromID[ServerProt.IF_SETANIM]);
        buffer.p2(interfaceId);
        buffer.p2(seqId);
        this.netOut.push(buffer);
    }

    setInterfaceText(interfaceId, text) {
        let buffer = new Packet();
        buffer.p1(ServerProtOpcodeFromID[ServerProt.IF_SETTEXT]);
        buffer.p2(0);
        let start = buffer.pos;

        buffer.p2(interfaceId);
        buffer.pjstr(text);

        buffer.psize2(buffer.pos - start);
        this.netOut.push(buffer);
    }

    setInterfaceModel(interfaceId, model) {
        let buffer = new Packet();
        buffer.p1(ServerProtOpcodeFromID[ServerProt.IF_SETMODEL]);

        buffer.p2(interfaceId);
        buffer.p2(model);

        this.netOut.push(buffer);
    }

    setInterfaceObject(interfaceId, item, zoom = 200) {
        let buffer = new Packet();
        buffer.p1(ServerProtOpcodeFromID[ServerProt.IF_SETOBJECT]);

        buffer.p2(interfaceId);
        buffer.p2(item);
        buffer.p2(zoom);

        this.netOut.push(buffer);
    }

    setInterfaceColor(interfaceId, color) {
        let buffer = new Packet();
        buffer.p1(ServerProtOpcodeFromID[ServerProt.IF_SETCOLOUR]);

        buffer.p2(interfaceId);
        buffer.p2(color);

        this.netOut.push(buffer);
    }

    closeModal(flush = true) {
        if (this.modalOpen || flush) {
            let packet = new Packet();
            packet.p1(ServerProtOpcodeFromID[ServerProt.IF_CLOSESUB]);
            this.netOut.push(packet);
        }

        this.modalOpen = false;
        this.welcomeOpen = false;
        this.interfaceScript = null;

        if (this.bankOpen) {
            this.closeBank();
        }
    }

    sendMessage(message) {
        let nextLine;
        if (message.length > 80) {
            nextLine = message.substring(80);
            message = message.substring(0, 80);
        }

        let packet = new Packet();
        packet.p1(ServerProtOpcodeFromID[ServerProt.MESSAGE_GAME]);
        packet.p1(0);
        let start = packet.pos;
        packet.pjstr(message);
        packet.psize1 (packet.pos - start);
        this.netOut.push(packet);

        if (nextLine) {
            this.sendMessage(nextLine);
        }
    }

    showMessage(...lines) {
        if (lines.length == 1) {
            this.setInterfaceText(357, lines[0]);
            this.openChatboxInterface(356);
        } else if (lines.length == 2) {
            this.setInterfaceText(360, lines[0]);
            this.setInterfaceText(361, lines[1]);
            this.openChatboxInterface(359);
        } else if (lines.length == 3) {
            this.setInterfaceText(364, lines[0]);
            this.setInterfaceText(365, lines[1]);
            this.setInterfaceText(366, lines[2]);
            this.openChatboxInterface(363);
        } else if (lines.length == 4) {
            this.setInterfaceText(369, lines[0]);
            this.setInterfaceText(370, lines[1]);
            this.setInterfaceText(371, lines[2]);
            this.setInterfaceText(372, lines[3]);
            this.openChatboxInterface(368);
        }
    }

    showChoices(...lines) {
        lines = lines.filter(l => l);

        if (lines.length == 2) {
            this.setInterfaceText(2461, lines[0]);
            this.setInterfaceText(2462, lines[1]);
            this.openChatboxInterface(2459);
        } else if (lines.length == 3) {
            this.setInterfaceText(2471, lines[0]);
            this.setInterfaceText(2472, lines[1]);
            this.setInterfaceText(2473, lines[2]);
            this.openChatboxInterface(2469);
        } else if (lines.length == 4) {
            this.setInterfaceText(2482, lines[0]);
            this.setInterfaceText(2483, lines[1]);
            this.setInterfaceText(2484, lines[2]);
            this.setInterfaceText(2485, lines[3]);
            this.openChatboxInterface(2480);
        } else if (lines.length == 5) {
            this.setInterfaceText(2494, lines[0]);
            this.setInterfaceText(2495, lines[1]);
            this.setInterfaceText(2496, lines[2]);
            this.setInterfaceText(2497, lines[3]);
            this.setInterfaceText(2498, lines[4]);
            this.openChatboxInterface(2492);
        }
    }

    // y: 23
    showObjectMessage(item, ...lines) {
        if (lines.length == 1) {
            this.setInterfaceObject(307, item);
            this.setInterfaceText(308, lines[0]);
            this.openChatboxInterface(306);
        } else if (lines.length == 2) {
            this.setInterfaceObject(311, item);
            this.setInterfaceText(312, lines[0]);
            this.setInterfaceText(313, lines[1]);
            this.openChatboxInterface(310);
        } else if (lines.length == 3) {
            this.setInterfaceObject(316, item);
            this.setInterfaceText(317, lines[0]);
            this.setInterfaceText(318, lines[1]);
            this.setInterfaceText(320, lines[2]);
            this.openChatboxInterface(315);
        } else if (lines.length == 4) {
            this.setInterfaceObject(322, item);
            this.setInterfaceText(323, lines[0]);
            this.setInterfaceText(324, lines[1]);
            this.setInterfaceText(326, lines[2]);
            this.setInterfaceText(327, lines[3]);
            this.openChatboxInterface(321);
        }
    }

    showPlayerMessage(animation, ...lines) {
        if (lines.length == 1) {
            this.setPlayerHead(969);
            this.setInterfaceAnimation(969, animation);
            this.setInterfaceText(970, this.username);
            this.setInterfaceText(971, lines[0]);
            this.openChatboxInterface(968);
        } else if (lines.length == 2) {
            this.setPlayerHead(974);
            this.setInterfaceAnimation(974, animation);
            this.setInterfaceText(975, this.username);
            this.setInterfaceText(976, lines[0]);
            this.setInterfaceText(977, lines[1]);
            this.openChatboxInterface(973);
        } else if (lines.length == 3) {
            this.setPlayerHead(980);
            this.setInterfaceAnimation(980, animation);
            this.setInterfaceText(981, this.username);
            this.setInterfaceText(982, lines[0]);
            this.setInterfaceText(983, lines[1]);
            this.setInterfaceText(984, lines[2]);
            this.openChatboxInterface(979);
        } else if (lines.length == 4) {
            this.setPlayerHead(987);
            this.setInterfaceAnimation(987, animation);
            this.setInterfaceText(988, this.username);
            this.setInterfaceText(989, lines[0]);
            this.setInterfaceText(990, lines[1]);
            this.setInterfaceText(991, lines[2]);
            this.setInterfaceText(992, lines[3]);
            this.openChatboxInterface(986);
        }
    }

    showNpcMessage(npc, animation, ...lines) {
        let name = NpcType.get(npc).name;

        if (lines.length == 1) {
            this.setNpcHead(4883, npc);
            this.setInterfaceAnimation(4883, animation);
            this.setInterfaceText(4884, name);
            this.setInterfaceText(4885, lines[0]);
            this.openChatboxInterface(4882);
        } else if (lines.length == 2) {
            this.setNpcHead(4888, npc);
            this.setInterfaceAnimation(4888, animation);
            this.setInterfaceText(4889, name);
            this.setInterfaceText(4890, lines[0]);
            this.setInterfaceText(4891, lines[1]);
            this.openChatboxInterface(4887);
        } else if (lines.length == 3) {
            this.setNpcHead(4894, npc);
            this.setInterfaceAnimation(4894, animation);
            this.setInterfaceText(4895, name);
            this.setInterfaceText(4896, lines[0]);
            this.setInterfaceText(4897, lines[1]);
            this.setInterfaceText(4898, lines[2]);
            this.openChatboxInterface(4893);
        } else if (lines.length == 4) {
            this.setNpcHead(4901, npc);
            this.setInterfaceAnimation(4901, animation);
            this.setInterfaceText(4902, name);
            this.setInterfaceText(4903, lines[1]);
            this.setInterfaceText(4904, lines[2]);
            this.setInterfaceText(4905, lines[3]);
            this.setInterfaceText(4906, lines[4]);
            this.openChatboxInterface(4900);
        }
    }

    showThievingLevelUp() {
        let level = this.levels[Skills.THIEVING];
        let unlocks = SkillUnlocks[Skills.THIEVING].filter(u => u.level == level);
        if (unlocks.length) {
            this.playJingle('advance thieving2');
        } else {
            this.playJingle('advance thieving');
        }

        this.executeInterface(new LevelUpDialogue(this, {
            members_skill: true,
            unlock_text: `Congratulations, you just advanced a thieving level.`,
            unlock_inter: 4261,
            unlock_inter_line1: 4263,
            unlock_text_line1: `@dbl@Congratulations, you just advanced a thieving level.`,
            unlock_inter_line2: 4264,
            unlock_text_line2: `Your thieving level is now ${level}.`,
            unlock_items: unlocks
        }));
    }

    showRunecraftLevelUp() {
        let level = this.levels[Skills.RUNECRAFT];
        let unlocks = SkillUnlocks[Skills.RUNECRAFT].filter(u => u.level == level);
        if (unlocks.length) {
            this.playJingle('advance runecraft2');
        } else {
            this.playJingle('advance runecraft');
        }

        this.executeInterface(new LevelUpDialogue(this, {
            members_skill: false,
            unlock_text: `Congratulations, you just advanced a runecraft level.`,
            unlock_inter: 4267,
            unlock_inter_line1: 4268,
            unlock_text_line1: `@dbl@Congratulations, you just advanced a runecraft level.`,
            unlock_inter_line2: 4269,
            unlock_text_line2: `Your runecraft level is now ${level}.`,
            unlock_items: unlocks
        }));
    }

    showWoodcuttingLevelUp() {
        let level = this.levels[Skills.WOODCUTTING];
        let unlocks = SkillUnlocks[Skills.WOODCUTTING].filter(u => u.level == level);
        if (unlocks.length) {
            this.playJingle('advance woodcutting2');
        } else {
            this.playJingle('advance woodcutting');
        }

        this.executeInterface(new LevelUpDialogue(this, {
            members_skill: false,
            unlock_text: `Congratulations, you just advanced a woodcutting level.`,
            unlock_inter: 4272,
            unlock_inter_line1: 4273,
            unlock_text_line1: `@dbl@Congratulations, you just advanced a woodcutting level.`,
            unlock_inter_line2: 4274,
            unlock_text_line2: `Your woodcutting level is now ${level}.`,
            unlock_items: unlocks
        }));
    }

    showAgilityLevelUp() {
        let level = this.levels[Skills.AGILITY];
        this.playJingle('advance agility');

        this.executeInterface(new LevelUpDialogue(this, {
            members_skill: false,
            unlock_text: `Congratulations, you just advanced an agility level.`,
            unlock_inter: 4277,
            unlock_inter_line1: 4278,
            unlock_text_line1: `@dbl@Congratulations, you just advanced an agility level.`,
            unlock_inter_line2: 4279,
            unlock_text_line2: `Your agility level is now ${level}.`,
            unlock_items: []
        }));
    }

    showFiremakingLevelUp() {
        let level = this.levels[Skills.FIREMAKING];
        let unlocks = SkillUnlocks[Skills.FIREMAKING].filter(u => u.level == level);
        if (unlocks.length) {
            this.playJingle('advance firemarking2');
        } else {
            this.playJingle('advance firemarking');
        }

        this.executeInterface(new LevelUpDialogue(this, {
            members_skill: false,
            unlock_text: `Congratulations, you just advanced a firemaking level.`,
            unlock_inter: 4282,
            unlock_inter_line1: 4283,
            unlock_text_line1: `@dbl@Congratulations, you just advanced a firemaking level.`,
            unlock_inter_line2: 4284,
            unlock_text_line2: `Your firemaking level is now ${level}.`,
            unlock_items: unlocks
        }));
    }

    showMiningLevelUp() {
        let level = this.levels[Skills.MINING];
        let unlocks = SkillUnlocks[Skills.MINING].filter(u => u.level == level);
        if (unlocks.length) {
            this.playJingle('advance mining2');
        } else {
            this.playJingle('advance mining');
        }

        this.executeInterface(new LevelUpDialogue(this, {
            members_skill: false,
            unlock_text: `Congratulations, you just advanced a mining level.`,
            unlock_inter: 4416,
            unlock_inter_line1: 4417,
            unlock_text_line1: `@dbl@Congratulations, you just advanced a mining level.`,
            unlock_inter_line2: 4438,
            unlock_text_line2: `Your mining level is now ${level}.`,
            unlock_items: unlocks
        }));
    }

    showRangedLevelUp() {
        let level = this.levels[Skills.RANGED];
        let unlocks = SkillUnlocks[Skills.RANGED].filter(u => u.level == level);
        if (unlocks.length) {
            this.playJingle('advance ranged2');
        } else {
            this.playJingle('advance ranged');
        }

        this.executeInterface(new LevelUpDialogue(this, {
            members_skill: false,
            unlock_text: `Congratulations, you just advanced a ranged level.`,
            unlock_inter: 4443,
            unlock_inter_line1: 5453,
            unlock_text_line1: `@dbl@Congratulations, you just advanced a ranged level.`,
            unlock_inter_line2: 6114,
            unlock_text_line2: `Your ranged level is now ${level}.`,
            unlock_items: unlocks
        }));
    }

    showStrengthLevelUp() {
        let level = this.levels[Skills.STRENGTH];
        let unlocks = SkillUnlocks[Skills.STRENGTH].filter(u => u.level == level);
        if (level >= 50) {
            this.playJingle('advance strength2');
        } else {
            this.playJingle('advance strength');
        }

        this.executeInterface(new LevelUpDialogue(this, {
            members_skill: false,
            unlock_text: `Congratulations, you just advanced a strength level.`,
            unlock_inter: 6206,
            unlock_inter_line1: 6207,
            unlock_text_line1: `@dbl@Congratulations, you just advanced a strength level.`,
            unlock_inter_line2: 6208,
            unlock_text_line2: `Your strength level is now ${level}.`,
            unlock_items: unlocks
        }));
    }

    showMagicLevelUp() {
        let level = this.levels[Skills.MAGIC];
        let unlocks = SkillUnlocks[Skills.MAGIC].filter(u => u.level == level);
        if (unlocks.length) {
            this.playJingle('advance magic2');
        } else {
            this.playJingle('advance magic');
        }

        this.executeInterface(new LevelUpDialogue(this, {
            members_skill: false,
            unlock_text: `Congratulations, you just advanced a magic level.`,
            unlock_inter: 6211,
            unlock_inter_line1: 6212,
            unlock_text_line1: `@dbl@Congratulations, you just advanced a magic level.`,
            unlock_inter_line2: 6213,
            unlock_text_line2: `Your magic level is now ${level}.`,
            unlock_items: unlocks
        }));
    }

    showHitpointsLevelUp() {
        let level = this.levels[Skills.MAGIC];
        let unlocks = SkillUnlocks[Skills.MAGIC].filter(u => u.level == level);
        if (level >= 50) {
            this.playJingle('advance hitpoints2');
        } else {
            this.playJingle('advance hitpoints');
        }

        this.executeInterface(new LevelUpDialogue(this, {
            members_skill: false,
            unlock_text: `Congratulations, you just advanced a hitpoints level.`,
            unlock_inter: 6216,
            unlock_inter_line1: 6217,
            unlock_text_line1: `@dbl@Congratulations, you just advanced a hitpoints level.`,
            unlock_inter_line2: 6218,
            unlock_text_line2: `Your hitpoints level is now ${level}.`,
            unlock_items: unlocks
        }));
    }

    showSmithingLevelUp() {
        let level = this.levels[Skills.SMITHING];
        let unlocks = SkillUnlocks[Skills.SMITHING].filter(u => u.level == level);
        if (unlocks.length) {
            this.playJingle('advance smithing2');
        } else {
            this.playJingle('advance smithing');
        }

        this.executeInterface(new LevelUpDialogue(this, {
            members_skill: false,
            unlock_text: `Congratulations, you just advanced a smithing level.`,
            unlock_inter: 6221,
            unlock_inter_line1: 6222,
            unlock_text_line1: `@dbl@Congratulations, you just advanced a smithing level.`,
            unlock_inter_line2: 6223,
            unlock_text_line2: `Your smithing level is now ${level}.`,
            unlock_items: unlocks
        }));
    }

    showCookingLevelUp() {
        let level = this.levels[Skills.COOKING];
        let unlocks = SkillUnlocks[Skills.COOKING].filter(u => u.level == level);
        if (unlocks.length) {
            this.playJingle('advance cooking2');
        } else {
            this.playJingle('advance cooking');
        }

        this.executeInterface(new LevelUpDialogue(this, {
            members_skill: false,
            unlock_text: `Congratulations, you just advanced a cooking level.`,
            unlock_inter: 6226,
            unlock_inter_line1: 6227,
            unlock_text_line1: `@dbl@Congratulations, you just advanced a cooking level.`,
            unlock_inter_line2: 6228,
            unlock_text_line2: `Your cooking level is now ${level}.`,
            unlock_items: unlocks
        }));
    }

    showFletchingLevelUp() {
        let level = this.levels[Skills.FLETCHING];
        let unlocks = SkillUnlocks[Skills.FLETCHING].filter(u => u.level == level);
        if (unlocks.length) {
            this.playJingle('advance fletching2');
        } else {
            this.playJingle('advance fletching');
        }

        this.executeInterface(new LevelUpDialogue(this, {
            members_skill: true,
            unlock_text: `Congratulations, you just advanced a fletching level.`,
            unlock_inter: 6231,
            unlock_inter_line1: 6232,
            unlock_text_line1: `@dbl@Congratulations, you just advanced a fletching level.`,
            unlock_inter_line2: 6233,
            unlock_text_line2: `Your fletching level is now ${level}.`,
            unlock_items: unlocks
        }));
    }

    showHerbloreLevelUp() {
        let level = this.levels[Skills.HERBLORE];
        let unlocks = SkillUnlocks[Skills.HERBLORE].filter(u => u.level == level);
        if (unlocks.length) {
            this.playJingle('advance herblaw2');
        } else {
            this.playJingle('advance herblaw');
        }

        this.executeInterface(new LevelUpDialogue(this, {
            members_skill: false,
            unlock_text: `Congratulations, you just advanced a herblore level.`,
            unlock_inter: 6237,
            unlock_inter_line1: 6238,
            unlock_text_line1: `@dbl@Congratulations, you just advanced a herblore level.`,
            unlock_inter_line2: 6239,
            unlock_text_line2: `Your herblore level is now ${level}.`,
            unlock_items: unlocks
        }));
    }

    showPrayerLevelUp() {
        let level = this.levels[Skills.PRAYER];
        let unlocks = SkillUnlocks[Skills.PRAYER].filter(u => u.level == level);
        if (unlocks.length) {
            this.playJingle('advance prayer2');
        } else {
            this.playJingle('advance prayer');
        }

        this.executeInterface(new LevelUpDialogue(this, {
            members_skill: false,
            unlock_text: `Congratulations, you just advanced a prayer level.`,
            unlock_inter: 6242,
            unlock_inter_line1: 6243,
            unlock_text_line1: `@dbl@Congratulations, you just advanced a prayer level.`,
            unlock_inter_line2: 6244,
            unlock_text_line2: `Your prayer level is now ${level}.`,
            unlock_items: unlocks
        }));
    }

    showAttackLevelUp() {
        let level = this.levels[Skills.ATTACK];
        let unlocks = SkillUnlocks[Skills.ATTACK].filter(u => u.level == level);
        if (unlocks.length) {
            this.playJingle('advance attack2');
        } else {
            this.playJingle('advance attack');
        }

        this.executeInterface(new LevelUpDialogue(this, {
            members_skill: false,
            unlock_text: `Congratulations, you just advanced an attack level.`,
            unlock_inter: 6247,
            unlock_inter_line1: 6248,
            unlock_text_line1: `@dbl@Congratulations, you just advanced an attack level.`,
            unlock_inter_line2: 6249,
            unlock_text_line2: `Your attack level is now ${level}.`,
            unlock_items: unlocks
        }));
    }

    showDefenceLevelUp() {
        let level = this.levels[Skills.DEFENCE];
        let unlocks = SkillUnlocks[Skills.DEFENCE].filter(u => u.level == level);
        if (unlocks.length) {
            this.playJingle('advance defense2');
        } else {
            this.playJingle('advance defense');
        }

        this.executeInterface(new LevelUpDialogue(this, {
            members_skill: false,
            unlock_text: `Congratulations, you just advanced a defence level.`,
            unlock_inter: 6253,
            unlock_inter_line1: 6254,
            unlock_text_line1: `@dbl@Congratulations, you just advanced a defence level.`,
            unlock_inter_line2: 6255,
            unlock_text_line2: `Your defence level is now ${level}.`,
            unlock_items: unlocks
        }));
    }

    showFishingLevelUp() {
        let level = this.levels[Skills.FISHING];
        let unlocks = SkillUnlocks[Skills.FISHING].filter(u => u.level == level);
        if (unlocks.length) {
            this.playJingle('advance fishing2');
        } else {
            this.playJingle('advance fishing');
        }

        this.executeInterface(new LevelUpDialogue(this, {
            members_skill: false,
            unlock_text: `Congratulations, you just advanced a fishing level.`,
            unlock_inter: 6258,
            unlock_inter_line1: 6259,
            unlock_text_line1: `@dbl@Congratulations, you just advanced a fishing level.`,
            unlock_inter_line2: 6260,
            unlock_text_line2: `Your fishing level is now ${level}.`,
            unlock_items: unlocks
        }));
    }

    showCraftingLevelUp() {
        let level = this.levels[Skills.CRAFTING];
        let unlocks = SkillUnlocks[Skills.CRAFTING].filter(u => u.level == level);
        if (unlocks.length) {
            this.playJingle('advance crafting2');
        } else {
            this.playJingle('advance crafting');
        }

        this.executeInterface(new LevelUpDialogue(this, {
            members_skill: false,
            unlock_text: `Congratulations, you just advanced a crafting level.`,
            unlock_inter: 6263,
            unlock_inter_line1: 6264,
            unlock_text_line1: `@dbl@Congratulations, you just advanced a crafting level.`,
            unlock_inter_line2: 6265,
            unlock_text_line2: `Your crafting level is now ${level}.`,
            unlock_items: unlocks
        }));
    }

    openSidebar(interfaceId) {
        let packet = new Packet();
        packet.p1(ServerProtOpcodeFromID[ServerProt.IF_OPENSIDEBAR]);
        packet.p2(interfaceId);
        this.netOut.push(packet);
    }

    setTab(interfaceId, tabId) {
        let packet = new Packet();
        packet.p1(ServerProtOpcodeFromID[ServerProt.IF_SETTAB]);
        packet.p2(interfaceId);
        packet.p1(tabId);
        this.netOut.push(packet);
    }

    setTabActive(tabId) {
        let packet = new Packet();
        packet.p1(ServerProtOpcodeFromID[ServerProt.IF_SETTAB_ACTIVE]);
        packet.p1(tabId);
        this.netOut.push(packet);
    }

    logoutCounter = 0;

    logout() {
        let packet = new Packet();
        packet.p1(ServerProtOpcodeFromID[ServerProt.LOGOUT]);
        this.netOut.push(packet);
        this.logoutCounter++;

        if (this.logoutCounter > 5) {
            this.client.socket.destroy();
        }
    }

    sendRebootTimer(clientTicks) {
        let packet = new Packet();
        packet.p1(ServerProtOpcodeFromID[ServerProt.UPDATE_REBOOT_TIMER]);
        packet.p2(clientTicks);
        this.netOut.push(packet);
    }

    clearFullArea() {
    }

    sendObjReveal(id, count, x, z) {
        // let buffer = new Packet();
        // buffer.p1(ServerProtOpcodeFromID[ServerProt.UPDATE_ZONE_PARTIAL_ENCLOSED]);
        // buffer.p2(0);
        // let start = buffer.pos;

        // buffer.p1(x - Position.zoneOrigin(this.lastX));
        // buffer.p1(z - Position.zoneOrigin(this.lastZ));

        // buffer.p1(ServerProtOpcodeFromID[ServerProt.OBJ_REVEAL]);

        // // dest = (x << 4) | z
        // buffer.p1(0); // TODO: we can batch these into zones of 8x8 by setting the tile here
        // buffer.p2(id);
        // buffer.p2(count);
        // // buffer.p2(1337);

        // buffer.psize2(buffer.pos - start);
        // this.netOut.push(buffer);
    }
}