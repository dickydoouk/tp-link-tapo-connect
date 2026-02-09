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

  ip?: string;
};

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
};

export type TapoProtocol = {
  send: (request: any) => any;
};

export type TapoDeviceKey = {
  key: Buffer;
  iv: Buffer;
  deviceIp: string;
  sessionCookie: string;
  token?: string;
};

export type TapoVideoImage = {
  uri: string;
  length: number;
  uriExpiresAt: number;
};

export type TapoVideo = {
  uri: string;
  duration: number;
  m3u8: string;
  startTimestamp: number;
  uriExpiresAt: number;
};

export type TapoVideoPageItem = {
  uuid: string;
  video: TapoVideo[];
  image: TapoVideoImage[];
  createdTime: number;
  eventLocalTime: string;
};

export type TapoVideoList = {
  deviceId: string;
  total: number;
  page: number;
  pageSize: number;
  index: TapoVideoPageItem[];
};

export enum AlarmTone {
  DoorbellRing1 = "Doorbell Ring 1",
  DoorbellRing2 = "Doorbell Ring 2",
  DoorbellRing3 = "Doorbell Ring 3",
  DoorbellRing4 = "Doorbell Ring 4",
  DoorbellRing5 = "Doorbell Ring 5",
  DoorbellRing6 = "Doorbell Ring 6",
  DoorbellRing7 = "Doorbell Ring 7",
  DoorbellRing8 = "Doorbell Ring 8",
  DoorbellRing9 = "Doorbell Ring 9",
  DoorbellRing10 = "Doorbell Ring 10",
  PhoneRing = "Phone Ring",
  Alarm1 = "Alarm 1",
  Alarm2 = "Alarm 2",
  Alarm3 = "Alarm 3",
  Alarm4 = "Alarm 4",
  Alarm5 = "Alarm 5",
  DrippingTap = "Dripping Tap",
  Connection1 = "Connection 1",
  Connection2 = "Connection 2",
}

export enum AlarmVolume {
  mute = "mute",
  low = "low",
  normal = "normal",
  high = "high",
}

export enum TapoDeviceEventType {
  motion = "motion",
  open = "open",
  close = "close",
}

export type TapoDeviceEventLog = {
  timestamp: number;
  eventId: string;
  event: TapoDeviceEventType;
  id: number;
};

export type TapoDeviceEventLogs = {
  responseData: {
    result: {
      logs: Array<TapoDeviceEventLog>;
      start_id: number;
      sum: number;
    };
    error_code: number;
  };
};
