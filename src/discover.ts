import find from "local-devices";
import { loginDeviceByIp } from "./api";

const TP_LINK_MAC_PREFIXES = [
  "84:d8:1b", // P100 Smart Plug
  "78:8c:b5", // C500 IP Camera
  "cc:ba:bd", // H100 Tapo Hub
  "e4:fa:c4", // P110 Smart Plug
  "ac:84:c6", // HS100 Smart Plug
  "50:c7:bf", // HS100 Smart Plug
];

export const discoverLocalDevices = async (email: string, password: string) => {
  const devices = await find({ skipNameResolution: true });

  return devices
    .filter((device) => isTapoMac(device.mac))
    .map((device) => ({
      loginDevice: () => loginDeviceByIp(email, password, device.ip),
    }));
};

const isTapoMac = (mac: string) =>
  TP_LINK_MAC_PREFIXES.find((oui) => mac.startsWith(oui));
