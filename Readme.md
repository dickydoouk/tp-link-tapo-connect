# TP-Link Tapo Connect

Unofficial Node.js library for connecting to TP-Link Tapo devices. Currently limited to the P100 & P105 smart plugs and L510E smart bulbs.

## Installation Instructions

```npm install tp-link-tapo-connect```

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

### Credits

Credit to this API go to:
* https://github.com/fishbigger/TapoP100
* https://github.com/K4CZP3R/tapo-p100-java-poc
