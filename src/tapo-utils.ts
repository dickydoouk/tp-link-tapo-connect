import { base64Decode } from "./tplink-cipher"
import { TapoDevice } from "./types"

export const augmentTapoDevice = async (deviceInfo: TapoDevice): Promise<TapoDevice> => {
    if (isTapoDevice(deviceInfo.deviceType)) {
      return {
        ...deviceInfo,
        alias: base64Decode(deviceInfo.alias)
      }
    } else {
      return deviceInfo
    }
  }
  
  export const isTapoDevice = (deviceType: string) => {
    switch (deviceType) {
      case 'SMART.TAPOPLUG':
      case 'SMART.TAPOBULB':
      case 'SMART.IPCAMERA':
      return true
      default: return false
    }
  }
  
  export const checkError = (responseData: any) => {
    const errorCode = responseData["error_code"];
    if (errorCode) {
      switch (errorCode) {
        case 0: return;
        case -1005: throw new Error("AES Decode Fail");
        case -1006: throw new Error("Request length error");
        case -1008: throw new Error("Invalid request params");
        case -1301: throw new Error("Rate limit exceeded");
        case -1101: throw new Error("Session params error");
        case -1010: throw new Error("Invalid public key length");
        case -1012: throw new Error("Invalid terminal UUID");
        case -1501: throw new Error("Invalid credentials");
        case -1002: throw new Error("Transport not available error");
        case -1003: throw new Error("Malformed json request");
        case -20004: throw new Error("API rate limit exceeded");
        case -20104: throw new Error("Missing credentials");
        case -20601: throw new Error("Incorrect email or password");
        case -20675: throw new Error("Cloud token expired or invalid");
        case 1000: throw new Error("Null transport error");
        case 1001: throw new Error("Command cancel error");
        case 1002: throw new Error("Transport not available error");
        case 1003: throw new Error("Device supports KLAP protocol - Legacy login not supported");
        case 1100: throw new Error("Handshake failed");
        case 1111: throw new Error("Login failed");
        case 1112: throw new Error("Http transport error");
        case 1200: throw new Error("Multirequest failed");
        case 9999: throw new Error("Session Timeout");
        default: throw new Error(`Unrecognised Error Code: ${errorCode} (${responseData["msg"]})`);
      }
    }
  }
