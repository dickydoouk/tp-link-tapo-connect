import { loginDeviceByIp } from "./klap-transport";

// const DEFAULT_KASA_SETUP_EMAIL = "kasa@tp-link.net"
// const DEFAULT_KASA_SETUP_PASSWORD = "kasaSetup"

const email = "<TP LINK ACCOUNT EMAIL>";
const password = "<TP LINK ACCOUNT PASSWORD>";
const deviceIp = "192.168.0.62";

xit ("getDeviceInfo", async () => {
    const device = await loginDeviceByIp(email, password, deviceIp);

    const statusResult = await device.getDeviceInfo();
    console.log({statusResult});
});

xit ("turnOn", async () => {
    const device = await loginDeviceByIp(email, password, deviceIp);
    
    await device.turnOn()
})
