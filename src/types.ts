
export type TapoDevice = {
    deviceType: string;
    fwVer: string;
    appServerUrl: string;
    deviceRegion: string;
    deviceId: string;
    deviceName: string;
    deviceHwVer: string;
    alias: string;
    deviceMac: string;
    oemId: string;
    deviceModel: string;
    hwId: string;
    fwId: string;
    isSameRegion: boolean;
    status: number;

    ip?: string
  }
  
  export type TapoDeviceInfo = {
    device_id: string;
    fw_ver: string;
    hw_ver: string;
    type: string;
    model: string;
    mac: string;
    hw_id: string;
    fw_id: string;
    oem_id: string;
    specs: string;
    device_on: boolean;
    on_time: number;
    overheated: boolean;
    nickname: string;
    location: string;
    avatar: string;
    time_usage_today: string;
    time_usage_past7: string;
    time_usage_past30: string;
    longitude: string;
    latitude: string;
    has_set_location_info: boolean;
    ip: string;
    ssid: string;
    signal_level: number;
    rssi: number;
    region: string;
    time_diff: number;
    lang: string; 
  }
  
  export type TapoDeviceKey = {
    key: Buffer;
    iv: Buffer;
    deviceIp: string;
    sessionCookie: string;
    token?: string;
  }