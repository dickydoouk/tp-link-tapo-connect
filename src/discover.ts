import find from "local-devices";
import { getLoginDetailsFromIP } from "./api";

export const discoverLocalDevices = async (email: string, password: string) => {
    const devices = await find({ skipNameResolution: true });

    return devices
        .filter(device => isTapoMac(device.mac))
        .map(device => ({
            loginDevice: () => getLoginDetailsFromIP(email, password, device.ip)
        }));
}

const isTapoMac = (mac:string) => {
    return mac.startsWith("84:d8:1b")
}

