import {createKlapEncryptionSession, loginDeviceByIp} from "./klap-transport";

// const DEFAULT_KASA_SETUP_EMAIL = "kasa@tp-link.net"
// const DEFAULT_KASA_SETUP_PASSWORD = "kasaSetup"

const email = "<TP LINK ACCOUNT EMAIL>";
const password = "<TP LINK ACCOUNT PASSWORD>";
const deviceIp = "192.168.0.62";

it ("getDeviceInfo", async () => {
    const loginDetails = await loginDeviceByIp(email, password, deviceIp);
    const device = createKlapEncryptionSession(loginDetails.deviceIp, loginDetails.localSeed, loginDetails.remoteSeed, loginDetails.localAuthHash, loginDetails.sessionCookie, loginDetails.seq)

    const statusResult = await device.getDeviceInfo();
    console.log({statusResult});
});

xit ("turnOn", async () => {
    const loginDetails = await loginDeviceByIp(email, password, deviceIp);
    const device = createKlapEncryptionSession(loginDetails.deviceIp, loginDetails.localSeed, loginDetails.remoteSeed, loginDetails.localAuthHash, loginDetails.sessionCookie, loginDetails.seq)


    await device.turnOn()
})