import { parse } from 'macaddr';
import arp from '@network-utils/arp-lookup'
import find from 'local-devices';

export const resolveMacToIp = async (mac: string) :Promise<string | null> => {
    const mac2 = tidyMac(mac);
    let trial = 0;
    let ip = await arp.toIP(mac2) ?? (await find()).find(devices => devices.mac === mac2)?.ip;

    while (trial < 5 && !ip) {
        trial++;
        ip = await arp.toIP(mac2) ?? (await find()).find(devices => devices.mac === mac2)?.ip;
    }

    return ip;
}

const tidyMac = (mac: string): string => 
    parse(mac).toString();
