import { resolveMacToIp } from './network-tools';

xtest('Resolve Mac to IP address', async () => {
    const devices = await resolveMacToIp("84D81B867782")
    console.log(devices);
})