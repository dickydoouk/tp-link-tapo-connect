# TP-Link Tapo Connect

Unofficial Node.js library for connecting to TP-Link Tapo devices. Currently limited to the:
- P100, P105, P110, P115 smart plugs
- L510E, L530E smart bulbs
- L900-10 smart strip
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
const cloudApi = await cloudLogin(email, password);
    
const devices = await cloudApi.listDevicesByType('SMART.TAPOPLUG');
```

Once you have determined which device you wish to use. You can enquire of its current state using:

```ts
const device = await loginDevice(email, password, devices[0]); // Performs a mac lookup to determine local IP address
// OR
const device = await loginDeviceByIp(email, password, deviceIp); // If you know your local device IP address
    
const getDeviceInfoResponse = await device.getDeviceInfo();
console.log(getDeviceInfoResponse);
```

To change the device state e.g. turn it on or off use:

```ts
await device.turnOn();
await device.setBrightness(75); // Sets brightness to 75% for smart bulbs only
await device.turnOff();
```

Changing the bulb colour (Colour smart bulbs only):

```ts
await device.turnOn();
await device.setColour('white'); // Sets the colour for colour smart bulbs only
await device.setColour('#FF00FF'); // Sets the colour for colour smart bulbs only using a hex value
await device.turnOff();
```

#### Available Preset Colours

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
const cloudVideos = await cloudApi.tapoCareCloudVideos(deviceId); //deviceId from listDevicesByType 
```

### Web API Endpoints

The library also provides a web API for device discovery and control. The web server is implemented using Express.js and provides the following endpoints:

- `POST /cloudLogin`: Login to the TP-Link cloud.
- `GET /listDevices`: List devices associated with the TP-Link account.
- `POST /loginDeviceByIp`: Login to a device using its IP address.
- `GET /discoverDevices`: Discover local devices on the network.

#### Example Usage

Start the web server:

```bash
node src/web-api.js
```

Login to the TP-Link cloud:

```bash
curl -X POST http://localhost:3000/cloudLogin -d '{"email": "your-email", "password": "your-password"}'
```

List devices:

```bash
curl -X GET http://localhost:3000/listDevices?email=your-email&password=your-password
```

Login to a device by IP:

```bash
curl -X POST http://localhost:3000/loginDeviceByIp -d '{"email": "your-email", "password": "your-password", "deviceIp": "192.168.0.1"}'
```

Discover local devices:

```bash
curl -X GET http://localhost:3000/discoverDevices?email=your-email&password=your-password
```

### Migrating from version 1 to 2

Version 2 favours returning a device object that has the necessary functions to manipulate the device rather
than passing the device/cloud token.

e.g.
```ts
const deviceToken = await loginDeviceByIp(email, password, deviceIp);
await turnOn(deviceToken);
```
is now
```ts
const device = await loginDeviceByIp(email, password, deviceIp);
await device.turnOn();
```

### Credits

Credit to this API go to:
* https://github.com/fishbigger/TapoP100
* https://github.com/K4CZP3R/tapo-p100-java-poc
* https://gist.github.com/chriswheeldon/3b17d974db3817613c69191c0480fe55
