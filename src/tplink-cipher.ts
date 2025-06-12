import crypto, {KeyObject} from 'crypto';
import util from 'util';
import type { TapoDeviceKey } from './types';

const RSA_CIPHER_ALGORITHM = 'rsa'
const AES_CIPHER_ALGORITHM = 'aes-128-cbc'
const PASSPHRASE = "top secret"

export const generateKeyPair = async () => {
    const RSA_OPTIONS = {
        modulusLength: 1024,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: PASSPHRASE
        }
    }
    const generateKeyPair = util.promisify(crypto.generateKeyPair);
    return generateKeyPair(RSA_CIPHER_ALGORITHM, RSA_OPTIONS)
}

export const encrypt = (data: any, deviceKey: TapoDeviceKey) : string => {
    var cipher = crypto.createCipheriv(AES_CIPHER_ALGORITHM, deviceKey.key, deviceKey.iv);
    var ciphertext = cipher.update(Buffer.from(JSON.stringify(data)));
    return Buffer.concat([ciphertext, cipher.final()]).toString('base64');
}

export const decrypt = (data: string, deviceKey: TapoDeviceKey) : any => {
    var cipher = crypto.createDecipheriv(AES_CIPHER_ALGORITHM, deviceKey.key, deviceKey.iv);
    var ciphertext = cipher.update(Buffer.from(data, 'base64'));
    return JSON.parse(Buffer.concat([ciphertext, cipher.final()]).toString());
}

export const readDeviceKey = (pemKey: string, privateKey: KeyObject) : Buffer => {
    const keyBytes = Buffer.from(pemKey, 'base64');
    const deviceKey = crypto.privateDecrypt({
        key: privateKey,
        padding:crypto.constants.RSA_PKCS1_PADDING,
        passphrase: PASSPHRASE,
    }, keyBytes);
    
    return deviceKey;
}


export const base64Encode = (data: string) : string => {
    return Buffer.from(data).toString('base64');
}

export const base64Decode = (data: string) : string => {
    if (!data) return ''
    return Buffer.from(data, 'base64').toString();
}

export const shaDigest = (data: string) : string => {
    var shasum = crypto.createHash('sha1')
    shasum.update(data)
    return shasum.digest('hex')
}
