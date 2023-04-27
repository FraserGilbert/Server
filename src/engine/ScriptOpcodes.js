const ScriptOpcodes = {
    // Language required opcodes
    PUSH_CONSTANT_INT: 0,
    PUSH_CONSTANT_STRING: 3,
    BRANCH: 6,
    BRANCH_NOT: 7,
    BRANCH_EQUALS: 8,
    BRANCH_LESS_THAN: 9,
    BRANCH_GREATER_THAN: 10,
    RETURN: 21,
    BRANCH_LESS_THAN_OR_EQUALS: 31,
    BRANCH_GREATER_THAN_OR_EQUALS: 32,
    PUSH_INT_LOCAL: 33,
    POP_INT_LOCAL: 34,
    PUSH_STRING_LOCAL: 35,
    POP_STRING_LOCAL: 36,
    JOIN_STRING: 37,
    POP_INT_DISCARD: 38,
    POP_STRING_DISCARD: 39,
    GOSUB_WITH_PARAMS: 40,
    DEFINE_ARRAY: 44,
    PUSH_ARRAY_INT: 45,
    POP_ARRAY_INT: 46,
    SWITCH: 60,

    // Server opcodes
    IF_CHATSELECT: 2000,
    P_PAUSEBUTTON: 2001,
    LAST_COMSUBID: 2002,
    JUMP: 2003,
    CHATNPC: 2004,
    ERROR: 2005,

    // Math opcodes
    ADD: 4000,
    SUB: 4001,
    MULTIPLY: 4002,
    DIVIDE: 4003,
    RANDOM: 4004,
    RANDOMINC: 4005,
    INTERPOLATE: 4006,
    ADDPERCENT: 4007,
    SETBIT: 4008,
    CLEARBIT: 4009,
    TESTBIT: 4010,
    MODULO: 4011,
    POW: 4012,
    INVPOW: 4013,
    AND: 4014,
    OR: 4015,
    SCALE: 4018,
    BITCOUNT: 4025,
    TOGGLEBIT: 4026,
    SETBIT_RANGE: 4027,
    CLEARBIT_RANGE: 4028,
    GETBIT_RANGE: 4029,
    SETBIT_RANGE_TOINT: 4030,
    SIN_DEG: 4032,
    COS_DEG: 4033,
    ABS: 4035,
};

// generate reverse lookup
for (let key in ScriptOpcodes) {
    ScriptOpcodes[ScriptOpcodes[key]] = key;
}

export default ScriptOpcodes;
