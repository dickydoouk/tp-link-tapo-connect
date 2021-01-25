import { resolveMacToIp } from './network-tools';

jest.setTimeout(30000)

xtest('Resolve Mac to IP address', async () => {
    const devices = await resolveMacToIp("84D81B866F07")
    console.log(devices);
})