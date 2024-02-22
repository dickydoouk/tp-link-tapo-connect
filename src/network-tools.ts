import { parse } from 'macaddr';
import arp from '@network-utils/arp-lookup'

export const resolveMacToIp = async (mac: string) :Promise<string | null> => {
    const mac2 = tidyMac(mac);
    const ip = await arp.toIP(mac2);
    return ip;
}

const tidyMac = (mac: string): string => 
    parse(mac).toString();
