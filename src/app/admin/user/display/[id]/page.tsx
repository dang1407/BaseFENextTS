"use client";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import adm_user from "@/entities/adm_user";
import { ApiService } from "@/utils/api-service";
import { useHandleError } from "@/hooks/useHandleError";
import { adm_userDTO } from "@/dtos/am_userDTO";
import ApiUrl from "@/constants/ApiUrl";
import { PageTitle } from '@/components/custom/PageTitle';
// import { DateTimePicker } from '@/components/custom/DatePicker';
import { DateTimePicker } from '@/components/custom/DatePicker';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/components/custom/LoadingContext';
export default function Display() {
  const [isInitPage, setInitPage] = useState<boolean>(true);
  const [user, setUser] = useState<adm_user>({});
  const params = useParams();
  const handleError = useHandleError();
  const router = useRouter();
  const loadingMangager = useLoading();
  async function setupDisplay() {
    try {
      loadingMangager.showLoading();
      const request = new adm_userDTO();
      request.user_id = Number(params.id);
      const response = await ApiService.post<adm_userDTO>(
        ApiUrl.User,
        "SetupDisplay",
        request
      );
      setUser(response.adm_user ?? new adm_user());
      setInitPage(false);
    } catch (error: any) {
      handleError(error);
    } finally {
    loadingMangager.hideLoading();
    }
  }

  useEffect(() => {
    setupDisplay();
  }, []);

  return (
    !isInitPage ?
    <div className="">
      <PageTitle title='Chi tiết người dùng'/>
      <div>
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col space-y-1.5">
            <Input value={user.name}  readOnly title='Họ và tên' id="name" placeholder="Name"  />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Input value={user.code} readOnly title='Mã' id="code" placeholder="Code"  />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Input value={user.username} readOnly title='Tên đăng nhập' id="username" placeholder="Username"  />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="date-of-birth">Ngày sinh</Label>
            <DateTimePicker value={user.dob} mode="date"
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Input value={user.email} readOnly title='Email' id="email" placeholder="Email"  />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Input value={user.phone} readOnly title='Số điện thoại' id="phone" placeholder="Phone"  />
          </div>
        </div>
        <Button onClick={() => router.push(`/admin/user/edit/${user.user_id}`)}>Sửa</Button>
      </div>
    </div>
    : <div>Loading</div>
  );
}
