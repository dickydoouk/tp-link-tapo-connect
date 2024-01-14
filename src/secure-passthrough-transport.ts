import axios from "axios";
import { base64Encode, decrypt, encrypt, generateKeyPair, readDeviceKey, shaDigest } from "./tplink-cipher";
import { TapoDeviceKey } from "./types";
import { TapoDevice } from "./tapo-device";
import { checkError } from "./tapo-utils";

export const loginDeviceByIp = async (email: string, password: string, deviceIp: string) => {
    const deviceKey = await handshake(deviceIp);
    const loginDeviceRequest =
        {
        "method": "login_device",
        "params": {
            "username": base64Encode(shaDigest(email)),
            "password": base64Encode(password)
        },
        "requestTimeMils": 0
    }
    
    const loginDeviceResponse =  await securePassthrough(loginDeviceRequest, deviceKey);
    deviceKey.token = loginDeviceResponse.token;

    const send = (request: any) => securePassthrough(request, deviceKey)
    
    return TapoDevice({
        send
    });
}

const handshake = async (deviceIp: string):Promise<TapoDeviceKey> => {
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