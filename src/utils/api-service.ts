import axios, { AxiosError, AxiosResponse } from 'axios';
import EncryptionService from "./encrypt";
import ApiUrl, {BASE_URL} from '@/constants/ApiUrl';
import AdmClientAuthenticate from '@/entities/authentications/AdmClientAuthenticate';
export class CustomError {
  ErrorCode?: string;
  UserMessage?: string;
  DevMessage?: string;
  TraceId?: string;
  MoreInfo?: string;
}
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const axiosNoAuth = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});


export class ApiService {
  public static readonly AccessTokenKey = process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || "access_token";
  private static getHeaders(actionCode?: string, aesKey?: string, clientAuthenticateID?: number) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (actionCode) {
      headers["X-Action-Code"] = actionCode;
    }

    if(aesKey){
      headers["X-A-Code"] = aesKey;
    }

    if(clientAuthenticateID){
      headers["X-B-Code"] = clientAuthenticateID?.toString();
    }
    // Thêm token nếu có
    const token = localStorage.getItem("access_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  public static async get<T>(url: string, actionCode?: string): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.get(url, {
      headers: this.getHeaders(actionCode),
    });
    return response.data;
  }

  public static async post<T>(
    url: string,
    actionCode: string,
    data: any
  ): Promise<T> {
    let encryptedData : string;
    if(typeof(data) === "string"){
      encryptedData = data
    } else {
      encryptedData = JSON.stringify(data);
    }
    const encryptKeyDataRes : AxiosResponse<AdmClientAuthenticate> = 
    await  axios.post(ApiUrl.GetEncryptData, {
      Url: url.replace(BASE_URL, ""),
    });
    const encryptKeyData = encryptKeyDataRes.data;
    const encryptionService = new EncryptionService();
    let encryptKeyRSA : string | false = "" ;
    if(encryptKeyData.public_key) {
      const encryptAESKeyIV: string = encryptionService.getAESKey() + ":" + encryptionService.getAESIV();
      encryptedData =  encryptionService.encryptAES(encryptedData);
      encryptKeyRSA = encryptionService.encryptRSA(encryptAESKeyIV, encryptKeyData.public_key);
      if(!encryptKeyRSA) throw Error("Thực hiện request thất bại (Encryptfailure)");
    }
    const header = this.getHeaders(actionCode, encryptKeyRSA, encryptKeyData.client_authenticate_id);
    // const header = this.getHeaders(actionCode);
    const response: AxiosResponse<T> = await axiosInstance.post(url, encryptedData, {
      headers: header,
    });
    return response.data;
  }

  public static async download(url: string, actionCode: string, data: any) {
    const response = await axiosInstance.post(url, data, {
      headers: {
        ...this.getHeaders(actionCode),
        responseType: "blob",
      },
    });

    // Tạo một URL tạm thời từ blob
    const fileURL = window.URL.createObjectURL(new Blob([response.data]));

    // Tạo một thẻ <a> ẩn để tải file
    const link = document.createElement("a");
    link.href = fileURL;
    document.body.appendChild(link);
    link.click();

    // Xóa thẻ <a> và URL tạm thời
    document.body.removeChild(link);
    window.URL.revokeObjectURL(fileURL);
  }
}