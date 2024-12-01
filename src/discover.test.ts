import { discoverLocalDevices } from './discover';
import {createKlapEncryptionSession} from "./klap-transport";

const email = "<TP LINK ACCOUNT EMAIL>";
const password = "<TP LINK ACCOUNT PASSWORD>";

xtest('Discover local devices', async () => {
    const devices = await discoverLocalDevices(email, password);
    console.log(devices);


    const login = await devices[0].loginDevice();
    const device = createKlapEncryptionSession(login.deviceIp, login.localSeed, login.remoteSeed, login.localAuthHash, login.sessionCookie, login.seq)
    const deviceInfo = await device.getDeviceInfo();

    console.log(deviceInfo);
});