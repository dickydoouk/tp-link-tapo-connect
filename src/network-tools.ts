import { parse } from 'macaddr';
import arp from '@network-utils/arp-lookup'

export const resolveMacToIp = async (mac: string) :Promise<string> => {
    return arp.toIP(tidyMac(mac));
}

const tidyMac = (mac: string): string => 
    parse(mac).toString();
