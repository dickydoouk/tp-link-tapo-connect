import { parse } from 'macaddr';
import arp from '@network-utils/arp-lookup'
import find from 'local-devices';

export const resolveMacToIp = async (mac: string) :Promise<string | null> => {
    const mac2 = tidyMac(mac);
    return await arp.toIP(mac2) ?? (await find()).find(devices => devices.mac === mac2)?.ip;
}

const tidyMac = (mac: string): string => 
    parse(mac).toString();
