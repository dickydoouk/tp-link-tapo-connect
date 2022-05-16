# TP-Link Tapo Connect

Unofficial Node.js library for connecting to TP-Link Tapo devices. Currently limited to the:
- P100 & P105 smart plugs
- L510E smart bulbs
- IP cameras like C320WS

## Installation Instructions

```bash
  npm install tp-link-tapo-connect
```

<br/>

## Usage

### Discovery

In order to discover your devices it is advisable to login to your TP-Link account and call the listDevices function. To do this:

```ts
const cloudToken = await cloudLogin(email, password);
    
const devices = await listDevicesByType(cloudToken, 'SMART.TAPOPLUG');
```

Once you have determined which device you wish to use. You can enquire of its current state using:

```ts
const deviceToken = await loginDevice(email, password, devices[0]); // Performs a mac lookup to determine local IP address
// OR
const deviceToken = await loginDeviceByIp(email, password, deviceIp); // If you know your local device IP address
    
const getDeviceInfoResponse = await getDeviceInfo(deviceToken);
console.log(getDeviceInfoResponse);
```

To change the device state e.g. turn it on or off use:

```ts
await turnOn(deviceToken);
await setBrightness(deviceToken, 75); // Sets brightness to 75% for smart bulbs only
await turnOff(deviceToken);
```

Changing the bulb colour (Colour smart bulbs only):

```ts
await turnOn(deviceToken);
await setColour(deviceToken, 'white'); // Sets the colour for colour smart bulbs only
await setColour(deviceToken, '#FF00FF'); // Sets the colour for colour smart bulbs only using a hex value
await turnOff(deviceToken);
```

#### Availble Preset Colours

||
| :-: |
| white |
| warmwhite |
| daylightwhite |
| blue |
| red |
| green |
| yellow |

<br/>

### Load videos from tapo-care cloud
```ts
const cloudVideos = await tapoCareCloudVideos(cloudToken, deviceId); //deviceId from listDevicesByType 
```

### Credits

Credit to this API go to:
* https://github.com/fishbigger/TapoP100
* https://github.com/K4CZP3R/tapo-p100-java-poc
