"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoginData from "./Login";
import { ApiService } from "@/utils/api-service";
import ApiUrl from "@/constants/ApiUrl";
import { useHandleError } from "@/hooks/useHandleError";

interface LoginResponse {
  AccessToken: string;
  CompanyId: string;
  RefreshToken: string;
  Role: string;
}

export default function LoginForm() {
  const handleError = useHandleError();
  const [loginData, setLoginData] = useState<LoginData>({
    UserName: "",
    Password: ""
  });
  const router = useRouter();
  const loginHandler = async () => {
    try {
      const response : LoginResponse = await ApiService.post<LoginResponse>(
        ApiUrl.Login,
        "",
        loginData
      );
      localStorage.setItem(ApiService.AccessTokenKey, response.AccessToken);
      router.push("/admin");
    } catch (error: any) {
      handleError(error);
    }
  }
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username: </Label>
                <Input
                  autoComplete="username"
                  id="username"
                  placeholder="Username"
                  onChange={(e: any) =>
                    setLoginData({
                      ...loginData,
                      UserName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  id="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  value={loginData.Password}
                  onChange={(e: any) =>
                    setLoginData({
                      ...loginData,
                      Password: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => loginHandler()}>Login</Button>
          <Button variant="outline">Already have an account.</Button>
        </CardFooter>
      </Card>
    </div>
  );
}