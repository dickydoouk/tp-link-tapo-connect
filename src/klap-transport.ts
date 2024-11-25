import axios from 'axios';
import { createCipheriv, randomBytes, createHash, createDecipheriv } from 'crypto';
import { TapoDevice } from './tapo-device';
import { checkError } from './tapo-utils';

// Typescript port of https://gist.github.com/chriswheeldon/3b17d974db3817613c69191c0480fe55

const AES_CIPHER_ALGORITHM = 'aes-128-cbc'

export const loginDeviceByIp = async (email: string, password: string, deviceIp: string) => {
    // handshake1
    const localSeed = randomBytes(16)
    
    const response = await axios.post(`http://${deviceIp}/app/handshake1`, localSeed,
    {
        responseType: 'arraybuffer',
        withCredentials: true
    }).catch((error) => {
        if (error?.response?.status === 404) {
            throw new Error(`Klap protocol not supported`)    
        }
        throw new Error(`handshake1 failed: ${error}`)
    });
    
    const responseBytes = Buffer.from(response.data);

    const setCookieHeader = response.headers['set-cookie'][0];
    const sessionCookie = setCookieHeader.substring(0,setCookieHeader.indexOf(';'))
    
    const remoteSeed = responseBytes.slice(0,16);
    const serverHash = responseBytes.slice(16);

    const localAuthHash = generateAuthHash(email, password)
    const localSeedAuthHash = handshake1AuthHash(
        localSeed, remoteSeed, localAuthHash
    )

    if (!compare(localSeedAuthHash, serverHash)) {
        throw new Error("email or password incorrect")
    }

    // handshake2
    const payload = handshake2AuthHash(localSeed, remoteSeed, localAuthHash);
    await axios.post(`http://${deviceIp}/app/handshake2`, payload,
    {
        responseType: 'arraybuffer',
        headers: {
            "Cookie": sessionCookie
        }
    })
    .catch((error) => { 
        throw new Error(`handshake2 failed: ${error}`)
    });
    
    return createKlapEncryptionSession(deviceIp, localSeed, remoteSeed, localAuthHash, sessionCookie)
}

const createKlapEncryptionSession = (deviceIp: string, localSeed: Buffer, remoteSeed: Buffer, userHash: Buffer, sessionCookie: String) => {
    const key = deriveKey(localSeed, remoteSeed, userHash);
    const iv = deriveIv(localSeed, remoteSeed, userHash);
    const sig = deriveSig(localSeed, remoteSeed, userHash);
    
    let seq = deriveSeqFromIv(iv);
            
    const encrypt = (payload: any) => {
        const payloadJson = JSON.stringify(payload);
        const cipher = createCipheriv(AES_CIPHER_ALGORITHM, key, ivWithSeq(iv,seq));
        var ciphertext = cipher.update(encode(payloadJson));
        return Buffer.concat([ciphertext, cipher.final()]);
    }

    const decrypt = (payload: Buffer):any => {
        const cipher = createDecipheriv(AES_CIPHER_ALGORITHM, key, ivWithSeq(iv,seq));
        var ciphertext = cipher.update(payload.slice(32));
        return JSON.parse(Buffer.concat([ciphertext, cipher.final()]).toString());
    }

    const encryptAndSign = (payload: any) => {
        const ciphertext = encrypt(payload);
        const signature = sha256(Buffer.concat([sig, seq, ciphertext]))
        return Buffer.concat([signature, ciphertext])
    }

    const send = async (deviceRequest: any):Promise<any> => {
        seq = incrementSeq(seq)

        const encryptedRequest = encryptAndSign(deviceRequest)
            
        const response = await axios({
            method: 'post',
            url: `http://${deviceIp}/app/request`,
            data: encryptedRequest,
            responseType: 'arraybuffer',
            headers: {
                "Cookie": sessionCookie
            },
            params: {
            seq: seq.readInt32BE()
            }
        })
        
        const decryptedResponse = decrypt(response.data);
        checkError(decryptedResponse);
        
        return decryptedResponse.result;
        }

    return TapoDevice({send})
}

export class ProtocolUnsupportedError extends Error {
    type: "ProtocolUnsupportedError"
};

const handshake1AuthHash = (localSeed: Buffer, remoteSeed: Buffer, authHash: Buffer) =>
    sha256(Buffer.concat([localSeed, remoteSeed, authHash]))

const handshake2AuthHash = (localSeed: Buffer, remoteSeed: Buffer, authHash: Buffer) =>
    sha256(Buffer.concat([remoteSeed, localSeed, authHash]))

const generateAuthHash = (email: string, password: string) =>
    sha256(Buffer.concat([sha1(email), sha1(password)]))

const deriveKey = (localSeed: Buffer, remoteSeed: Buffer, userHash: Buffer) =>
    sha256(Buffer.concat([encode("lsk"), localSeed, remoteSeed, userHash])).slice(0,16)

const deriveIv = (localSeed: Buffer, remoteSeed: Buffer, userHash: Buffer) =>
    sha256(Buffer.concat([encode("iv"), localSeed, remoteSeed, userHash]));

const deriveSig = (localSeed: Buffer, remoteSeed: Buffer, userHash: Buffer) =>
    sha256(Buffer.concat([encode("ldk"), localSeed, remoteSeed, userHash])).slice(0,28)

const deriveSeqFromIv = (iv: Buffer) => iv.slice(iv.length-4);

const ivWithSeq = (iv: Buffer, seq: Buffer) =>
    Buffer.concat([iv.slice(0,12), seq])

const incrementSeq = (seq: Buffer) => {
    const buffer = Buffer.alloc(4);
    buffer.writeInt32BE(seq.readInt32BE()+1);
    return buffer;
}

const sha256 = (data: string | Buffer) =>
    createHash('sha256').update(data).digest();

const sha1 = (data: string | Buffer) => 
    createHash('sha1').update(data).digest();

const compare = (b1: Buffer, b2: Buffer) => b1.compare(b2) === 0 

const encode = (text: string) => Buffer.from(text, "utf-8");

