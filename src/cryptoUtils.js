import CryptoJS from 'crypto-js';

const encryptionKey = "aLtAeNCrypT";

export const encryptRequest = (data) => {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), encryptionKey).toString();
  return { request_data: ciphertext };
};

export const decryptResponse = (data) => {
  const bytes = CryptoJS.AES.decrypt(data.response_data, encryptionKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};