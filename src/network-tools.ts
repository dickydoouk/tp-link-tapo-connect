import find from 'local-devices'

export const resolveMacToIp = async (mac: string) :Promise<string> => {
    const devices = await find();
    return devices.find(device => tidyMac(device.mac) == tidyMac(mac)).ip
}

const tidyMac = (mac: string): string => {
    return mac.replace(/:/g, '').toUpperCase();
}