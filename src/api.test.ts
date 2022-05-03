import { cloudLogin, listDevices, listDevicesByType, loginDevice, loginDeviceByIp, getDeviceInfo, turnOn, setBrightness, setColour, checkError } from './api';

const email = "<TP LINK ACCOUNT EMAIL>";
const password = "<TP LINK ACCOUNT PASSWORD>";
const deviceIp = "192.168.0.62";

xtest('Login using ENV Vars & list devices', async () => {
    const cloudToken = await cloudLogin();
    
    const devices = await listDevices(cloudToken);
    console.log(devices);
});

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

xtest('List smart bulbs', async () => {
    const cloudToken = await cloudLogin(email, password);
    
    const devices = await listDevicesByType(cloudToken, 'SMART.TAPOBULB');
    console.log(devices);
    
    const smartBulb = devices[0];
    console.log(smartBulb);

    const deviceToken = await loginDevice(email, password, smartBulb);
    const getDeviceInfoResponse = await getDeviceInfo(deviceToken);
    console.log(getDeviceInfoResponse);
});

xtest('Turn device on', async () => {
    const deviceToken = await loginDeviceByIp(email, password, deviceIp);
    
    const getDeviceInfoResponse = await getDeviceInfo(deviceToken);
    console.log(getDeviceInfoResponse);

    await turnOn(deviceToken);
});

xtest('Set bulb colour', async () => {
    const cloudToken = await cloudLogin(email, password);
    
    const devices = await listDevicesByType(cloudToken, 'SMART.TAPOBULB');
    console.log(devices);
    
    const smartBulb = devices[0];
    console.log(smartBulb);

    const deviceToken = await loginDevice(email, password, smartBulb);
    await turnOn(deviceToken);
    await setBrightness(deviceToken, 75);
    await setColour(deviceToken, 'warmwhite');
});

test('Handle unknown error, throwing a helpful error message', async () => {
    expect(() => {
        checkError({
            error_code: -20004,
            msg: "API rate limit exceeded"
        })
    }).toThrow('Unexpected Error Code: -20004 (API rate limit exceeded)')
});

