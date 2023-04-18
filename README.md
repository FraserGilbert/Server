# 2004scape

This is an open-source emulation project targeting May 2004.

[Website](https://2004scape.org), [Discord](https://discord.gg/hN3tHUmZEN), [Rune-Server](https://www.rune-server.ee/runescape-development/rs2-server/projects/701698-lost-city-225-emulation.html)

## Dependencies

- NodeJS 16+, so the server can run. I use Node 19.
- Java, so JagCompress.jar can generate 1:1 copies of files from source. Very important for CRC matching.

## Running the server for the first time

This may take a few minutes to parse all the text files and turn them into their encoded versions. This only needs to be ran once. 

```sh
cp .env.example .env

# install dependencies
npm i

# generates client cache under data/cache/
node tools/pack/ConfigFromDef.js

# generates client maps (tile map) under data/maps/
node tools/pack/MapLandFromText.js

# generates client maps (object map) under data/maps/
node tools/pack/MapLocFromText.js

# generates cache -> server ID mappings
node tools/cache/InitJsMapping.js

npm start
```

ConfigFromDef should be ran whenever a def file is updated.  
InitJsMapping.js should be ran whenever loc.def, npc.def, or obj.def has a name added or updated.  
MapLandFromText.js should be ran whenever a "mX_Z" file is updated.  
MapLocFromText.js should be ran whenever a "lX_Z" file is updated.  

If you get locked out of the account server (or stuck logged in), you can use local player saves by editing .env and commenting out MASTER_ADDRESS with a #. There's also an API to force logging out, but it's not documented yet.

## Scripting

The "yield" keyword is very important. It allows NodeJS to stop executing the script immediately and check the conditions before running again. Generator functions are used to manage/restore the control flow.  

## pm2 (optional)

pm2 is a node process manager that I use to autostart/restart the server.

`pm2 start src/app.js --kill-timeout 10000`

The timeout is necessary so the system reboot timer can run and flush player data before quitting.