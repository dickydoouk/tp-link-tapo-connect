import { getColour } from "./colour-helper"
import { base64Decode } from "./tplink-cipher"
import { TapoDeviceInfo, TapoProtocol } from "./types"

export const TapoDevice = ({ send }: TapoProtocol) => {

  const wrapRequestForChildDevice = (request: any, deviceId: string | undefined) => {
    // No child means no need to wrap
    if  (!deviceId) return request

    return {
      method: 'control_child',
      params: {
        device_id: deviceId,
        // Note: requestData can be an array of requests with the block below
        requestData: request,
        // requestData: {
        // 	method: 'multipleRequest',
        // 	params: {requests: [request]}
        // },
      }
    }
  }

    const setDeviceOn = async (deviceOn: boolean, deviceId: string | undefined) => {
        const turnDeviceOnRequest = {
          "method": "set_device_info",
          "params":{
            "device_on": deviceOn,
          }
        }
        await send(wrapRequestForChildDevice(turnDeviceOnRequest, deviceId))
      }

      const augmentTapoDeviceInfo = (deviceInfo: TapoDeviceInfo): TapoDeviceInfo => {
        return {
          ...deviceInfo,
          ssid: base64Decode(deviceInfo.ssid),
          nickname: base64Decode(deviceInfo.nickname),
        }
    }

    return {
      

      turnOn: (deviceId?: string) => setDeviceOn(true, deviceId),
      
      turnOff: (deviceId?: string) => setDeviceOn(false, deviceId),
      
      setBrightness: async (brightnessLevel: number = 100) => {
        const setBrightnessRequest = {
          "method": "set_device_info",
          "params":{
            "brightness": brightnessLevel,
          }
        }
        await send(setBrightnessRequest)
      },
      
      setColour: async (colour: string = 'white') => {
        const params = getColour(colour);
      
        const setColourRequest = {
          "method": "set_device_info",
          params
        }
        await send(setColourRequest)
      },

      setHSL: async (hue: number, sat: number, lum: number) => {
        const normalisedHue = hue % 360;
        const normalisedSat = Math.max(0, Math.min(100, sat));
        const normalisedLum = Math.max(0, Math.min(100, lum));

        if(normalisedLum === 0) {
          await setDeviceOn(false, undefined)
        }

        const setHSLRequest = {
          "method": "set_device_info",
          "params":{
            "hue": normalisedHue,
            "saturation": normalisedSat,
            "brightness": normalisedLum
          }
        }
        await send(setHSLRequest)
      },
      
      getDeviceInfo:async (): Promise<TapoDeviceInfo> => {
        const statusRequest = {
          "method": "get_device_info"
        }
        return augmentTapoDeviceInfo(await send(statusRequest))
      },

      getChildDevicesInfo: async (): Promise<Array<TapoDeviceInfo>> => {
        const listChildDeviceRequest = {
          "method": "get_child_device_list",
          start_index: 0,
        }
    
        const res = await send(listChildDeviceRequest)
      
        return res.child_device_list.map((deviceInfo) => augmentTapoDeviceInfo(deviceInfo)).sort((a, b) => a.position - b.position)
      },

      getEnergyUsage: async (): Promise<TapoDeviceInfo> => {
        const statusRequest = {
          "method": "get_energy_usage"
        }
        return await send(statusRequest)
      }
    }     
}
