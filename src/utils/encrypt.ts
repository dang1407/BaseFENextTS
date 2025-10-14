// encryptionService.ts
import CryptoJS from 'crypto-js';
import JSEncrypt from "jsencrypt";
class EncryptionService {
  public aesKey: CryptoJS.lib.WordArray;
  public aesIV: CryptoJS.lib.WordArray;
  constructor() {
    // Tạo AES key ngẫu nhiên (trong thực tế, key này nên được trao đổi an toàn qua RSA)
    this.aesKey = this.generateAESKey();
    this.aesIV = this.generateAESIV();
  }

  // Tạo AES key 256-bit
  private generateAESKey(): CryptoJS.lib.WordArray {
    return CryptoJS.lib.WordArray.random(16);
  }

  private generateAESIV() : CryptoJS.lib.WordArray {
    return CryptoJS.lib.WordArray.random(16);
  }

  // Mã hóa dữ liệu
  encryptAES(data: string): string {
    const encrypted = CryptoJS.AES.encrypt(data, this.aesKey, {
      iv: this.aesIV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  }

  // Giải mã dữ liệu
  decryptAES(encryptedData: string): any {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, this.aesKey, {
      iv: this.aesIV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(jsonString);
  }

  encryptRSA(data: any, publicKey: string): string | false{
    const dataString = JSON.stringify(data);
    const jsEncrypt = new JSEncrypt();
    jsEncrypt.setPublicKey(publicKey);
    const cipherText = jsEncrypt.encrypt(dataString);
    return cipherText;
  }

  // Lấy AES key (để gửi cho server qua RSA encryption)
  getAESKey(): string {
    return CryptoJS.enc.Base64.stringify(this.aesKey);
  }

  // Set AES key (khi nhận từ server)
  setAESKey(key: CryptoJS.lib.WordArray): void {
    this.aesKey = key;
  }

  getAESIV(): string {
    return CryptoJS.enc.Base64.stringify(this.aesIV);
  }

  setAESIV(ivStr: CryptoJS.lib.WordArray){
    this.aesIV = ivStr;
  }
}

export default EncryptionService;