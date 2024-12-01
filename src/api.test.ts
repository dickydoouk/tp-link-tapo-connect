import { cloudLogin, loginDevice, getLoginDetailsFromIP } from './api';
import { checkError } from './tapo-utils';
import {createKlapEncryptionSession} from "./klap-transport";

const email = "<TP LINK ACCOUNT EMAIL>";
const password = "<TP LINK ACCOUNT PASSWORD>";
const deviceIp = "192.168.0.62";

xtest('Login using ENV Vars & list devices', async () => {
    const cloudApi = await cloudLogin();
    
    const devices = await cloudApi.listDevices();
    console.log(devices);
});

xtest('Login & list devices', async () => {
    const cloudApi = await cloudLogin(email, password);
    
    const devices = await cloudApi.listDevices();
    console.log(devices);
});

xtest('List smart plugs', async () => {
    const cloudApi = await cloudLogin(email, password);
    
    const devices = await cloudApi.listDevicesByType('SMART.TAPOPLUG');
    console.log(devices);
    
    const smartPlug = devices[1];
    console.log(smartPlug);

    const login = await loginDevice(email, password, smartPlug);
    const device = createKlapEncryptionSession(login.deviceIp, login.localSeed, login.remoteSeed, login.localAuthHash, login.sessionCookie, login.seq);
    const getDeviceInfoResponse = await device.getDeviceInfo();
    console.log(getDeviceInfoResponse);

});

xtest('List smart bulbs', async () => {
    const cloudApi = await cloudLogin(email, password);
    
    const devices = await cloudApi.listDevicesByType('SMART.TAPOBULB');
    console.log(devices);
    
    const smartBulb = devices[0];
    console.log(smartBulb);

    const login = await loginDevice(email, password, smartBulb);
    const device = createKlapEncryptionSession(login.deviceIp, login.localSeed, login.remoteSeed, login.localAuthHash, login.sessionCookie, login.seq)
    const getDeviceInfoResponse = await device.getDeviceInfo();
    console.log(getDeviceInfoResponse);
});

xtest('Turn device on', async () => {
    const login = await getLoginDetailsFromIP(email, password, deviceIp);
    const device = createKlapEncryptionSession(login.deviceIp, login.localSeed, login.remoteSeed, login.localAuthHash, login.sessionCookie, login.seq)
    
    const getDeviceInfoResponse = await device.getDeviceInfo();
    console.log(getDeviceInfoResponse);

    await device.turnOn();
});

xtest('Set bulb colour', async () => {
    const cloudApi = await cloudLogin(email, password);
    
    const devices = await cloudApi.listDevicesByType('SMART.TAPOBULB');
    console.log(devices);
    
    const smartBulb = devices[0];
    console.log(smartBulb);

    const login = await loginDevice(email, password, smartBulb);
    const device = createKlapEncryptionSession(login.deviceIp, login.localSeed, login.remoteSeed, login.localAuthHash, login.sessionCookie, login.seq)
    await device.turnOn();
    await device.setBrightness(75);
    await device.setColour('warmwhite');
});

xtest('Handle unknown error, throwing a helpful error message', async () => {
    expect(() => {
        checkError({
            error_code: -20004,
            msg: "API rate limit exceeded"
        })
    }).toThrow('Unexpected Error Code: -20004 (API rate limit exceeded)')
});

