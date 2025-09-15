// hooks/useAuth.ts
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiService } from "@/utils/api-service";
import ApiUrl from "@/constants/ApiUrl";
import { useHandleError } from "./useHandleError";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLogined, setIsLogined] = useState<boolean>(false);
  const handleError = useHandleError();

  useEffect(() => {
    const accessToken = localStorage.getItem(ApiService.AccessTokenKey);

    if (!accessToken) {
       window.location.href = '/login';
    } else {
      // setToken(accessToken);
      const relogin = async () => {
        try {
          const request = {};
          const response = await ApiService.post(
            ApiUrl.ReLogin,
            "",
            JSON.stringify(request)
          );
          setIsLogined(true);
        } catch (error: any) {
          handleError(error);
          // Clear token and redirect to login when relogin fails
          localStorage.removeItem(ApiService.AccessTokenKey);
           window.location.href = '/login';
        }
      }
      relogin();
    }

    setLoading(false);
  }, []);

  return { isLogined, loading };
}
