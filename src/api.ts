import axios from 'axios';
import { encrypt, decrypt, generateKeyPair, readDeviceKey, base64Encode, base64Decode, shaDigest } from "./tplinkCipher";
import { TapoDevice, TapoDeviceKey, TapoDeviceInfo } from "./types";
import { resolveMacToIp } from './network-tools';
import { getColour } from './colour-helper';
import { timeout } from './time-helper'; 

const baseUrl = 'https://eu-wap.tplinkcloud.com/'

export {
    TapoDevice,
    TapoDeviceKey,
    TapoDeviceInfo
};

export const cloudLogin = async (email: string = process.env.TAPO_USERNAME || undefined, password: string = process.env.TAPO_PASSWORD || undefined): Promise<string> => {
  const loginRequest = {
    "method": "login",
    "params": {
      "appType": "Tapo_Android",
      "cloudPassword": password,
      "cloudUserName": email,
      "terminalUUID": "59284a9c-e7b1-40f9-8ecd-b9e70c90d19b"
    }
  }
  const response = await axios({
    method: 'post',
    url: baseUrl,
    data: loginRequest
  })

  checkError(response.data);

  return response.data.result.token;
}

export const listDevices = async (cloudToken: string): Promise<Array<TapoDevice>> => {
  const getDeviceRequest = {
    "method": "getDeviceList",
  }
  const response = await axios({
    method: 'post',
    url: `${baseUrl}?token=${cloudToken}`,
    data: getDeviceRequest
  })

  checkError(response.data);

  return Promise.all(response.data.result.deviceList.map(async deviceInfo => augmentTapoDevice(deviceInfo)));
}

export const listDevicesByType = async (cloudToken: string, deviceType: string): Promise<Array<TapoDevice>> => {
  const devices = await listDevices(cloudToken);
  return devices.filter(d => d.deviceType === deviceType);
}

export const handshake = async (deviceIp: string):Promise<TapoDeviceKey> => {
  const keyPair = await generateKeyPair();

  const handshakeRequest = 
    {
      method: "handshake",
      params: {
          "key": keyPair.publicKey
     }
  }
  const response = await axios({
    method: 'post',
    url: `http://${deviceIp}/app`,
    data: handshakeRequest
  })

  checkError(response.data);

  const setCookieHeader = response.headers['set-cookie'][0];
  const sessionCookie = setCookieHeader.substring(0,setCookieHeader.indexOf(';'))

  const deviceKey = readDeviceKey(response.data.result.key, keyPair.privateKey)
    
  return {
    key: deviceKey.subarray(0,16),
    iv: deviceKey.subarray(16,32),
    deviceIp,
    sessionCookie
  }
}

export const loginDevice = async (email: string = process.env.TAPO_USERNAME || undefined, password: string = process.env.TAPO_PASSWORD || undefined, device: TapoDevice) => 
  loginDeviceByIp(email, password, await resolveMacToIp(device.deviceMac));

export const loginDeviceByIp = async (email: string = process.env.TAPO_USERNAME || undefined, password: string = process.env.TAPO_PASSWORD || undefined, deviceIp: string):Promise<TapoDeviceKey> => {
  const deviceKey = await handshake(deviceIp);
  const loginDeviceRequest = 
    {
      "method": "login_device",
      "params": {
          "username": base64Encode(shaDigest(email)), 
          "password": base64Encode(password)
     }
  }

  const loginDeviceResponse =  await securePassthrough(loginDeviceRequest, deviceKey);
  deviceKey.token = loginDeviceResponse.token;
  return deviceKey;
}

export const turnOn = async (deviceKey: TapoDeviceKey, deviceOn: boolean = true) => {
  const turnDeviceOnRequest = {
    "method": "set_device_info",
    "params":{
      "device_on": deviceOn,
    }
  }
  await securePassthrough(turnDeviceOnRequest, deviceKey)
}

export const turnOnAfter = async (deviceKey: TapoDeviceKey, seconds) => {
  await timeout(seconds * 1000);
  await turnOn(deviceKey);
}

export const turnOff = async (deviceKey: TapoDeviceKey) => {
  return turnOn(deviceKey, false);
}

export const turnOffAfter = async (deviceKey: TapoDeviceKey, seconds) => {
  await timeout(seconds * 1000);
  await turnOff(deviceKey);
}

export const setBrightness = async (deviceKey: TapoDeviceKey, brightnessLevel: number = 100) => {
  const setBrightnessRequest = {
    "method": "set_device_info",
    "params":{
      "brightness": brightnessLevel,
    }
  }
  await securePassthrough(setBrightnessRequest, deviceKey)
}

export const setColour = async (deviceKey: TapoDeviceKey, colour: string = 'white') => {    
  const params = await getColour(colour);

  const setColourRequest = {
    "method": "set_device_info",
    params
  }
  await securePassthrough(setColourRequest, deviceKey)
}

export const getDeviceInfo = async (handshakeResponse: TapoDeviceKey): Promise<TapoDeviceInfo> => {
  const turnDeviceOnRequest = {
    "method": "get_device_info"
  }
  return augmentTapoDeviceInfo(await securePassthrough(turnDeviceOnRequest, handshakeResponse))
}

export const securePassthrough = async (deviceRequest: any, deviceKey: TapoDeviceKey):Promise<any> => {
  const encryptedRequest = encrypt(deviceRequest, deviceKey)
  const securePassthroughRequest = {
    "method": "securePassthrough",
    "params": {
        "request": encryptedRequest, 
    }
  }

  const response = await axios({
    method: 'post',
    url: `http://${deviceKey.deviceIp}/app?token=${deviceKey.token}`,
    data: securePassthroughRequest,
    headers: {
      "Cookie": deviceKey.sessionCookie
    }
  })

  checkError(response.data);

  const decryptedResponse = decrypt(response.data.result.response, deviceKey);
  checkError(decryptedResponse);

  return decryptedResponse.result;
}  

const augmentTapoDevice = async (deviceInfo: TapoDevice): Promise<TapoDevice> => {
  if (isTapoDevice(deviceInfo.deviceType)) {
    return {
      ...deviceInfo,
      alias: base64Decode(deviceInfo.alias)
    }
  } else {
    return deviceInfo
  }
}

const augmentTapoDeviceInfo = (deviceInfo: TapoDeviceInfo): TapoDeviceInfo => {
    return {
      ...deviceInfo,
      ssid: base64Decode(deviceInfo.ssid),
      nickname: base64Decode(deviceInfo.nickname),
    }
}

export const isTapoDevice = (deviceType: string) => {
  switch (deviceType) {
    case 'SMART.TAPOPLUG':
    case 'SMART.TAPOBULB':
    return true
    default: return false
  }
}

const checkError = (responseData: any) => {
  const errorCode = responseData["error_code"];
  if (errorCode) {
    switch (errorCode) {
      case 0: return;
      case -1010: throw new Error("Invalid public key length");
      case -1501: throw new Error("Invalid request or credentials");
      case -1002: throw new Error("Incorrect request");
      case -1003: throw new Error("JSON format error");
      case -20601: throw new Error("Incorrect email or password");
      case -20675: throw new Error("Cloud token expired or invalid");
      case 9999: throw new Error("Device token expired or invalid");
      default: throw new Error(`Unexpected Error Code: ${errorCode}`);
    }
    
  }
}
