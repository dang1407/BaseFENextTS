import { useToast } from "@/hooks/use-toast";
import { CustomError } from "@/utils/api-service";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
export const useHandleError = () => {
  const { toast } = useToast();
  const navigate = useRouter();

  const handleAxiosError = (error: AxiosError) => {
    const status = error.response?.status;
    const responseData = error.response?.data;
  
    let customError: CustomError | null = null;
    let message: string;
  
    // Kiểm tra nếu response có đúng định dạng CustomError
    if (typeof responseData === "string") {
      try {
        customError = JSON.parse(responseData);
      } catch {
        // console.error("Failed to parse error response:", e);
      }
    } else if (typeof responseData === "object") {
      customError = responseData as CustomError;
    }
  
    if (customError) {
      message = `${customError.UserMessage} (Error Code: ${customError.ErrorCode})`;
    } else {
      message = error.message;
    }
  
    switch (status) {
      case 400:
        // message = `Bad Request: ${message}`;
        toast({
          title: "Lỗi",
          description: message
        });
        break;
      case 401:
          {
        // message = "Unauthorized: Please login again";
        // Có thể thêm logic để redirect đến trang login
        const delay : number = Number(process.env.NEXT_PUBLIC_REDIRECT_LOGIN_DELAY ?? 1) ;
        toast({
          title: "Phiên đăng nhập hết hạn",
          description: `Tự động chuyển đến trang đăng nhập sau ${delay} giây!`
        });
        setTimeout(() => {
          navigate.push("/login")
        }, delay*1000);
        break;
      }
      case 403:
        // message = "Forbidden: You don't have permission to access this resource";
        toast({
          title: "Lỗi",
          description: message
        });
        break;
      case 500:
        // message = "Internal Server Error: Please try again later";
        toast({
          title: "Lỗi",
          description: message
        });
        break;
      default:
        toast({
          title: "Lỗi",
          description: message
        });
    }
  
    // console.error("API Error:", {
    //   status,
    //   message,
    //   traceId: customError?.TraceId,
    //   moreInfo: customError?.MoreInfo,
    // });
    
    throw customError;
  } 

  return (error: Error) => {
    if(axios.isAxiosError(error)){
      handleAxiosError(error);
    } else {
      console.log(error)
    }
  };
};

