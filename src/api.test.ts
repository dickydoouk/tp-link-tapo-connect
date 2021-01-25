import { cloudLogin, listDevices, listDevicesByType, loginDevice, loginDeviceByIp, getDeviceInfo, turnOn } from './api';

const email = "<TP LINK ACCOUNT EMAIL>";
const password = "<TP LINK ACCOUNT PASSWORD>";
const deviceIp = "192.168.0.62";

xtest('Login & list devices', async () => {
    const cloudToken = await cloudLogin(email, password);
    
    const devices = await listDevices(cloudToken);
    console.log(devices);
});

xtest('List smart plugs', async () => {
    const cloudToken = await cloudLogin(email, password);
    
    const devices = await listDevicesByType(cloudToken, 'SMART.TAPOPLUG');
    console.log(devices);
    
    const smartPlug = devices[0];
    console.log(smartPlug);

    const deviceToken = await loginDevice(email, password, smartPlug);
    const getDeviceInfoResponse = await getDeviceInfo(deviceToken);
    console.log(getDeviceInfoResponse);

});

xtest('Turn device on', async () => {
    const deviceToken = await loginDeviceByIp(email, password, deviceIp);
    
    const getDeviceInfoResponse = await getDeviceInfo(deviceToken);
    console.log(getDeviceInfoResponse);

    await turnOn(deviceToken);
});

