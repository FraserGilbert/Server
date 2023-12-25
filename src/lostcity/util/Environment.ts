import 'dotenv/config';

function tryParse(value?: string) {
    if (typeof value === 'undefined') {
        return null;
    }

    // try parse as int
    if (/^-?\d+$/.test(value)) {
        const intValue = parseInt(value);
        if (!isNaN(intValue)) {
            return intValue;
        }
    }

    // try parse as boolean
    if (value === 'true') {
        return true;
    } else if (value === 'false') {
        return false;
    }

    // return as string
    return value;
}

export default {
    PUBLIC_IP: tryParse(Deno.env.get('PUBLIC_IP')) ?? '',
    WEB_PORT: tryParse(Deno.env.get('WEB_PORT')) ?? 0,
    GAME_PORT: tryParse(Deno.env.get('GAME_PORT')) ?? 0,

    LOGIN_HOST: tryParse(Deno.env.get('LOGIN_HOST')) ?? '',
    LOGIN_PORT: tryParse(Deno.env.get('LOGIN_PORT')) ?? 0,
    LOGIN_KEY: tryParse(Deno.env.get('LOGIN_KEY')) ?? '',

    FRIEND_HOST: tryParse(Deno.env.get('FRIEND_HOST')) ?? '',
    FRIEND_PORT: tryParse(Deno.env.get('FRIEND_PORT')) ?? 0,
    FRIEND_KEY: tryParse(Deno.env.get('FRIEND_KEY')) ?? '',

    WORLD_ID: tryParse(Deno.env.get('WORLD_ID')) ?? 0,
    LOCAL_DEV: tryParse(Deno.env.get('LOCAL_DEV')) ?? false,
    MEMBERS_WORLD: tryParse(Deno.env.get('MEMBERS_WORLD')) ?? true,
    XP_MULTIPLIER: tryParse(Deno.env.get('XP_MULTIPLIER')) ?? 1,
    SHUTDOWN_TIMER: tryParse(Deno.env.get('SHUTDOWN_TIMER')) ?? 50,

    HTTPS_CERT: tryParse(Deno.env.get('HTTPS_CERT')) ?? '',
    CLIRUNNER: tryParse(Deno.env.get('CLIRUNNER')) ?? false,
    CI_MODE: tryParse(Deno.env.get('CI_MODE')) ?? false,
    SKIP_CORS: tryParse(Deno.env.get('SKIP_CORS')) ?? false,
};
