import axios, {AxiosInstance} from 'axios';
import * as https from "https";
import {v4 as uuidv4} from 'uuid';
import {resolveMacToIp} from './network-tools';
import {
  LoginDetails,
  TapoDevice,
  TapoDeviceInfo,
  TapoDeviceKey,
  TapoVideo,
  TapoVideoImage,
  TapoVideoList,
  TapoVideoPageItem
} from "./types";
import {createKlapEncryptionSession, loginDeviceByIp as loginKlapDeviceByIp} from "./klap-transport";
import {loginDeviceByIp as loginLegacyDeviceByIp} from "./secure-passthrough-transport";
import tplinkCaCert from './tplink-ca-cert';
import {augmentTapoDevice, checkError} from './tapo-utils';

// another variant is https://n-euw1-wap-gw.tplinkcloud.com
const baseUrl = 'https://eu-wap.tplinkcloud.com/'

/**
 * also url may be one of that:
 * "http://use1-relay-dcipc.i.tplinknbu.com"
 * "http://aps1-relay-dcipc-beta.i.tplinknbu.com"
 * "http://euw1-relay-dcipc.i.tplinknbu.com"
 * "http://aps1-relay-dcipc-beta.i.tplinknbu.com"
 * "http://aps1-relay-dcipc.i.tplinknbu.com"
 * "http://aps1-relay-dcipc-beta.i.tplinknbu.com"
 */
const baseTapoCareUrl = 'https://euw1-app-tapo-care.i.tplinknbu.com'

export {
  TapoDevice,
  TapoDeviceKey,
  TapoDeviceInfo,
  TapoVideoImage,
  TapoVideoPageItem,
  TapoVideoList,
  TapoVideo,
};

export const cloudLogin = async (email: string = process.env.TAPO_USERNAME || undefined, password: string = process.env.TAPO_PASSWORD || undefined) => {
  const loginRequest = {
    "method": "login",
    "params": {
      "appType": "Tapo_Android",
      "cloudPassword": password,
      "cloudUserName": email,
      "terminalUUID": '98bd4d0b-9c78-49eb-8b7e-be34e9cb2648'
    }
  }
  const response = await axios({
    method: 'post',
    url: baseUrl,
    data: loginRequest
  })

  checkError(response.data);

  const cloudToken = response.data.result.token
    
const listDevices = async (): Promise<Array<TapoDevice>> => {
  const getDeviceRequest = {
    "method": "getDeviceList",
  }
  const response = await axios({
    method: 'post',
    url: baseUrl,
    data: getDeviceRequest,
    params: {
      token: cloudToken
    }
  })

  checkError(response.data);

  return Promise.all(response.data.result.deviceList.map(async deviceInfo => augmentTapoDevice(deviceInfo)));
}

const listDevicesByType = async (deviceType: string): Promise<Array<TapoDevice>> => {
  const devices = await listDevices();
  return devices.filter(d => d.deviceType === deviceType);
}

const tapoCareCloudVideos = async (deviceId: string, order: string = 'desc', page: number = 0, pageSize: number = 20, startTime: string | null = null, endTime: string | null = null): Promise<TapoVideoList> => {
  const response = await tplinkCaAxios()({
    method: 'get',
    url: `${baseTapoCareUrl}/v1/videos`,
    params: {
      deviceId,
      page,
      pageSize,
      order,
      startTime,
      endTime,
    },
    headers: {
      'authorization': `ut|${cloudToken}`,
    },
  })

  checkTapoCareError(response)

  return <TapoVideoList> response.data
}

return {
  listDevices,
  listDevicesByType,
  tapoCareCloudVideos
}
}

export const loginDevice = async (email: string = process.env.TAPO_USERNAME || undefined, password: string = process.env.TAPO_PASSWORD || undefined, device: TapoDevice) : Promise<LoginDetails> => {
  const localIp = await resolveMacToIp(device.deviceMac);

  if (!localIp) {
    throw new Error(`Local IP of device with Mac address ${device.deviceMac} not found.`);
  }

  return getLoginDetailsFromIP(email, password, localIp);
}

export const getLoginDetailsFromIP = async (email: string = process.env.TAPO_USERNAME || undefined, password: string = process.env.TAPO_PASSWORD || undefined, deviceIp: string) : Promise<LoginDetails>  => {
  // Attempts to login using newer klap protocol first, then fallback to legacy secure pass through protocol
    return await loginKlapDeviceByIp(email, password, deviceIp);
}

export const createKlapEncryption = (login : LoginDetails)=> {
  return createKlapEncryptionSession(login.deviceIp, login.localSeed, login.remoteSeed, login.localAuthHash, login.sessionCookie, login.seq);
}

const tplinkCaAxios = (): AxiosInstance => {
  const httpsAgent = new https.Agent({
    rejectUnauthorized: true,
    ca: tplinkCaCert,
  })

  return axios.create({ httpsAgent })
}


const checkTapoCareError = (responseData: any) => {
  const errorCode = responseData?.code;
  if (errorCode) {
    throw new Error(`Unrecognised Error Code: ${errorCode} (${responseData["message"]})`);
  }
}
