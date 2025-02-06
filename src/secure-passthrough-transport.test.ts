import { loginDeviceByIp } from "./secure-passthrough-transport";

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
