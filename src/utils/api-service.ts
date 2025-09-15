import axios, { AxiosError, AxiosResponse } from 'axios';
export class CustomError {
  ErrorCode?: string;
  UserMessage?: string;
  DevMessage?: string;
  TraceId?: string;
  MoreInfo?: string;
}
const axiosInstance = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiService {
  public static readonly AccessTokenKey = process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || "access_token";
  private static getHeaders(actionCode?: string) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (actionCode) {
      headers["X-Action-Code"] = actionCode;
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
    const response: AxiosResponse<T> = await axiosInstance.post(url, data, {
      headers: this.getHeaders(actionCode),
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