ID <-> name mapping is done inside `data/pack/<ext>.pack`.

All configs are loaded recursively from the `data/src/scripts` directory. They can be split up or organized in any subfolder, and will be loaded based on their extension. Ordering is preserved by maintaing a .pack file.  
Each config gets exposed to the script engine using the named identifier inside square brackets.

All boolean values are yes/no instead of true/false.
You do not need to specify a value if it's already the default.

The basic format is:
```
[config name]
configkey=value
```

## Floor

Overlay/underlay colors and textures. Underlays do not support textures.

extension: flo

| Config | Description | Values | Default |
|-|-|-|-|
| rgb | Color to display on a tile | RGB hex color code | 0 |
| texture | Texture to display on a tile | Name of texture under src/binary/textures/ |
| overlay | Type to display in editor (unused) | Boolean | false
| occlude | | Boolean | true |
| editname | Name to display in editor (unused) | String |

```
[example]
rgb=0x00FF00
texture=water
overlay=yes
occlude=no
editname=example
```

## Identity Kit

Player body parts.

extension: idk

| Config | Description | Values | Default |
|-|-|-|-|
| type | Bodypart type | man_, woman_ followed by: hair, jaw, torso, arms, hands, legs |
| model(n) | Set a model for index n | Model |
| head(n) | Set a chathead model for index n | Model |
| disable | Prevent the player from selecting this in the design interface | Boolean | false |
| recol(n)s | Source color | RS2 HSL |
| recol(n)d | Destination color | RS2 HSL |

```
[example]
type=man_hair
model=model_1000
head=model_1001
disable=yes
recol1s=0
recol1d=1
```

## Location

3D objects in the world.

extension: loc

| Config | Description | Values | Default |
|-|-|-|-|
| model | Sets the world model | Model |
| name | Sets the display name | String |
| desc | Sets the examine text | String |
| width | Sets the length of this config in tiles | 1 to 255 | 1 |
| length | Sets the width of this config in tiles | 1 to 255 | 1 |
| blockwalk | Blocks line of walk checks | Boolean | true |
| blockrange | Blocks line of sight checks | Boolean | true |
| active | Overrides if an object can be interacted/examined regardless of its type/options | Boolean | Derived from type/options |
| hillskew | Adjust model to fit terrain| Boolean | false |
| sharelight | Share vertex lighting with nearby connected models| Boolean | false |
| occlude | | Boolean | false |
| anim | Default animation to loop | Sequence |
| hasalpha | Prevent client from caching alpha frames | Boolean | false |
| walloff | Offset from wall | Powers of 2 | 16 |
| ambient | Lighting parameter | -128 to 127 | 0 |
| contrast | Lighting parameter | -128 to 127 | 0 |
| op(n) | Interaction option | String, or "hidden" to hide from the client so the server can trigger it in a script |
| recol(n)s | Source color | RS2 HSL |
| recol(n)d | Destination color | RS2 HSL |
| mapfunction | Minimap icon (shops, banks, etc) | Sprite tile index inside src/sprites/mapfunction.png |
| mirror | Flip object | Boolean | false |
| shadow | Calculate shadowmap | Boolean | true |
| resizex | Resize model on X axis | 0-65535 | 128 |
| resizey | Resize model on Y axis | 0-65535 | 128 |
| resizez | Resize model on Z axis | 0-65535 | 128 |
| mapscene | Minimap icon (trees, rocks, etc) | Sprite tile index inside src/sprites/mapscene.png |
| forceapproach | Pathfinder hint | north, east, south, west |
| xoff | x offset from tile origin | -32768 to 32767 | 0 |
| yoff | y offset from tile origin | -32768 to 32767 | 0 |
| zoff | z offset from tile origin | -32768 to 32767 | 0 |
| forcedecor | | Boolean | false |
| param | Parameter for scripts | key=value |

```
[example]
model=model_1000
name=Example
desc=This is an example.
width=2
length=2
blockwalk=no
blockrange=no
active=yes
hillskew=yes
sharelight=yes
occlude=yes
anim=seq_1
hasalpha=yes
walloff=8
ambient=50
contrast=50
op1=Open
recol1s=0
recol1d=1
mapfunction=10
mirror=yes
shadow=yes
resizex=128
resizey=128
resizez=128
mapscene=10
forceapproach=north
xoff=140
yoff=140
zoff=140
forcedecor=yes
param=test=1234
```

## NPC

Non-playable characters in the world.

extension: npc

| Config | Description | Values | Default |
|-|-|-|-|
| model(n) | Set a model for index n | Model |
| head(n) | Set a chathead model for index n | Model |
| name | Sets the display name | String |
| desc | Sets the examine text | String |
| size | NPC size in tiles: n*n | 1-255 | 1 |
| readyanim | Idle animation | Sequence |
| walkanim | Walking animation | Sequence |
| walkanim_b | Turn around animation | Sequence |
| walkanim_r | Right turn animation | Sequence |
| walkanim_l | Left turn animation | Sequence |
| hasalpha | Prevent client from caching alpha frames | Boolean | false |
| op(n) | Interaction option | String, or "hidden" to hide from the client so the server can trigger it in a script |
| recol(n)s | Source color | RS2 HSL |
| recol(n)d | Destination color | RS2 HSL |
| code90 | | 0 to 65535 | -1 |
| code91 | | 0 to 65535 | -1 |
| code92 | | 0 to 65535 | -1 |
| visonmap | Override mapdot visibility on minimap | Boolean | true |
| vislevel | Visible combat level | 1 to 65535, "hide" / 0 | -1 |
| resizeh | Resize horizontally (x) | 0 to 65535 | 128 |
| resizev | Resize vertically (y) | 0 to 65535 | 128 |
| param | Parameter for scripts | key=value |

```
[example]
model1=model_1000
model2=model_1001
head1=model_1002
name=Example
desc=This is an example.
size=2
readyanim=seq_1
walkanim=seq_2
walkanim_b=seq_3
walkanim_r=seq_4
walkanim_l=seq_5
hasalpha=yes
op1=Talk-to
recol1s=0
recol1d=1
visonmap=hide
resizeh=128
resizev=128
param=test=1234
```

## Objects

Items.

extension: obj

| Config | Description | Values | Default |
|-|-|-|-|
| model | Set visible model | Model |
| name | Sets the display name | String |
| desc | Sets the examine text | String |
| 2dxof | 2d x offset for icon | -32767 to 32768 | 0 | 
| 2dyof | 2d y offset for icon | -32767 to 32768 | 0 |
| 2dzoom | 2d zoom for icon | 0 to 65535 | 2000 |
| 2dxan | 2d x angle for icon | 0 to 65535 | 0 |
| 2dyan | 2d y angle for icon | 0 to 65535 | 0 |
| 2dzan | 2d z angle for icon | 0 to 65535 | 0 |
| code9 | | Boolean | false |
| code10 | | Sequence |
| stackable | If this item should stack | Boolean | false |
| cost | Item value in shops | 0 to 2,147,483,647 | 1 |
| member | Indicates if this is a members-only item | Boolean | false |
| manwear | Male model slot when equipped, along with offset | Model, Offset |
| manwear2 | Secondary model slot when equipped | Model |
| manwear3 | Tertiary model slot when equipped | Model |
| manhead | Male chathead slot when equipped | Model |
| manhead2 | Secondary chathead slot when equipped | Model |
| womanwear | Female model slot when equipped, along with offset | Model, Offset |
| womanwear2 | Secondary model slot when equipped | Model |
| womanwear3 | Tertiary model slot when equipped | Model |
| womanhead | Female chathead slot when equipped | Model |
| womanhead2 | Secondary chathead slot when equipped | Model |
| op(n) | Ground interaction option | String |
| iop(n) | Interface interaction option | String |
| recol(n)s | Source color | RS2 HSL |
| recol(n)d | Destination color | RS2 HSL |
| certlink | Linked object to inherit and draw | Object |
| certtemplate | Template object to draw behind model (noted paper) | Object |
| count(n) | Templates to replace this item's properties with if above a certain amount | Object, followed by Amount (0 to 65535) |
| weight | Weight of item in a given unit, converts to grams internally | Grams (g), Kilograms (kg), Ounces (oz), and Pounds (lb) | 0 |
| wearpos | Slot to equip into or override | hat, back, front, righthand, body, lefthand, arms, legs, head, hands, feet, jaw, ring, quiver |
| wearpos2 | Slot to equip into or override | hat, back, front, righthand, body, lefthand, arms, legs, head, hands, feet, jaw, ring, quiver |
| wearpos3 | Slot to equip into or override | hat, back, front, righthand, body, lefthand, arms, legs, head, hands, feet, jaw, ring, quiver |
| param | Parameter for scripts | key=value |

```
[example]
model=model_1000
name=Example
desc=This is an example.
2dxof=-4
2dyof=12
2dzoom=1780
2dyan=436
2dxan=320
stackable=yes
cost=1000
member=yes
manwear=model_1001,0
manwear2=model_1002
manwear3=model_1003
manhead=model_1004
manhead2=model_1005
womanwear=model_1006,6
womanwear2=model_1007
womanwear3=model_1008
womanhead=model_1009
womanhead2=model_1010
op4=Light
iop2=Wear
recol1s=0
recol1d=1
certlink=obj_1
certtemplate=obj_2
count1=obj_3,2
count2=obj_4,3
weight=10kg
wearpos=righthand
wearpos2=lefthand
wearpos3=arms
param=test=1234
```

## Sequence

Sequences of animation frames to play.

extension: seq

| Config | Description | Values | Default |
|-|-|-|-|
| frame(n) | Frames to play | |
| iframe(n) | Frames to play on interfaces (chatheads) | |
| delay(n) | | |
| replayoff | | |
| walkmerge | | |
| stretches | | Boolean | false |
| priority | | | 5 |
| mainhand | Override mainhand (righthand) appearance | Object or "hide" |
| offhand | Override offhand (lefthand) appearance | Object or "hide" |
| replaycount | | | 99 |

```
[example]
frame1=anim_1234
iframe1=anim_1235
delay1=400
replayoff=yes
walkmerge=label_1,label_2
stretches=yes
priority=6
mainhand=obj_1
offhand=obj_2
replaycount=4
```

## Spotanim

Graphical animated effects intended to play in a spot in the world.

extension: spotanim

| Config | Description | Values | Default |
|-|-|-|-|
| model | Sets the world model | Model |
| anim | Default animation to loop | Sequence |
| hasalpha | Prevent client from caching alpha frames | Boolean | false |
| resizeh | Resize horizontally (x) | 0 to 65535 | 128 |
| resizev | Resize vertically (y) | 0 to 65535 | 128 |
| orientation | Degrees to rotate | 0 to 360 | 0 |
| ambient | Lighting parameter | -128 to 127 | 0 |
| contrast | Lighting parameter | -128 to 127 | 0 |
| recol(n)s | Source color | RS2 HSL |
| recol(n)d | Destination color | RS2 HSL |

```
[example]
model=model_1
anim=seq_1
hasalpha=yes
resizeh=100
resizev=100
orientation=270
ambient=50
contrast=50
recol1s=0
recol1d=1
```

## Player Variable

Variables stored on the player, used for client interfaces, quest progression, or inside scripts.

extension: varp

| Config | Description | Values | Default |
|-|-|-|-|
| code1 | | |
| code2 | | |
| code3 | | |
| code4 | | |
| clientcode | Link to hardcoded variable in client | 1 to 8 | 0 |
| code6 | | |
| code7 | | |
| code8 | | |
| code10 | | |
| transmit | How frequently to transmit changes | never, always |

```
[example]
clientcode=7
transmit=always
```
