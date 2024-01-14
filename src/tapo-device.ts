import { getColour } from "./colour-helper"
import { base64Decode } from "./tplink-cipher"
import { TapoDeviceInfo, TapoProtocol } from "./types"

export const TapoDevice = ({ send }: TapoProtocol) => {

    const setDeviceOn = async (deviceOn: boolean = true) => {
        const turnDeviceOnRequest = {
          "method": "set_device_info",
          "params":{
            "device_on": deviceOn,
          }
        }
        await send(turnDeviceOnRequest)
      }

      const augmentTapoDeviceInfo = (deviceInfo: TapoDeviceInfo): TapoDeviceInfo => {
        return {
          ...deviceInfo,
          ssid: base64Decode(deviceInfo.ssid),
          nickname: base64Decode(deviceInfo.nickname),
        }
    }

    return {
      turnOn: () => setDeviceOn(true),
      
      turnOff: () => setDeviceOn(false),
      
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
      
      getDeviceInfo:async (): Promise<TapoDeviceInfo> => {
        const statusRequest = {
          "method": "get_device_info"
        }
        return augmentTapoDeviceInfo(await send(statusRequest))
      },

      getEnergyUsage: async (): Promise<TapoDeviceInfo> => {
        const statusRequest = {
          "method": "get_energy_usage"
        }
        return await send(statusRequest)
      }
    }     
}