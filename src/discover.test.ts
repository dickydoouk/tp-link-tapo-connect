import { discoverLocalDevices } from './discover';

const email = "<TP LINK ACCOUNT EMAIL>";
const password = "<TP LINK ACCOUNT PASSWORD>";

xtest('Discover local devices', async () => {
    const devices = await discoverLocalDevices(email, password);
    console.log(devices);

    const device = await devices[0].loginDevice();
    const deviceInfo = await device.getDeviceInfo();

    console.log(deviceInfo);
});