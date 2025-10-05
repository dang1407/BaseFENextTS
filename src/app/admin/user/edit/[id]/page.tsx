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
import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/custom/DatePicker';
import { FieldValidator } from '@/components/custom/FieldValidator';
import { useParams, useRouter } from 'next/navigation';
import { ApiActionCode } from '@/constants/SharedResources';
export default function CreateUser() {
  const [user, setUser] = useState<adm_user>({});
  const handleError = useHandleError();
  const params = useParams();
  const router = useRouter();
  async function setupEdit() {
      try {
        const request = new adm_userDTO();
        request.user_id = Number(params.id);
        const response = await ApiService.post<adm_userDTO>(
          ApiUrl.User,
          ApiActionCode.SetupUpdateForm,
          request
        );
        setUser(response.adm_user ?? new adm_user());
      } catch (error: any) {
        handleError(error);
      }
    }
  async function editUser() {
    try {
      if(FieldValidator.HasError()){
        throw new Error("Lỗi thông tin đã nhập");
      }
      const request = new adm_userDTO();
      request.adm_user = user;
      const response = await ApiService.post<adm_userDTO>(
        ApiUrl.User,
        ApiActionCode.UpdateItem,
        request
      );
      router.push(`/admin/user/display/${request.adm_user.user_id}`);
    } catch (error: any) {
      handleError(error);
    }
  }

  useEffect(() => {
    setupEdit()
  }, []);
  return (
    <div className="">
      <PageTitle title='Chỉnh sửa người dùng'/>
      <div>
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col space-y-1.5">
            <Input required title='Họ và tên' value={user.name} id="name" placeholder="Name" onChange={(e) => setUser((prevUser) => ({ ...prevUser, name: e.target.value }))} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Input title='Mã' value={user.code} id="code" placeholder="Code" onChange={(e) => setUser((prevUser) => ({ ...prevUser, code: e.target.value }))} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Input required title='Tên đăng nhập' value={user.username} id="username" placeholder="Username" onChange={(e) => setUser((prevUser) => ({ ...prevUser, username: e.target.value }))} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="date-of-birth">Ngày sinh</Label>
            <DateTimePicker value={user.dob} mode="date"
              onChange={(d) => setUser((prevUser) => ({ ...prevUser, dob: d }))}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Input title='Email' value={user.email} id="email" placeholder="Email" onChange={(e) => setUser((prevUser) => ({ ...prevUser, email: e.target.value }))} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Input title='Số điện thoại' value={user.phone} id="phone" placeholder="Phone" onChange={(e) => setUser((prevUser) => ({ ...prevUser, phone: e.target.value }))} />
          </div>
        </div>
      </div>
      <div className='flex justify-end mt-4'>
        <div className="flex gap-4">
          <Button onClick={() => editUser()} >Lưu</Button>
          <Button onClick={() => router.push(`/admin/user`)}>Thoát</Button>
        </div>
      </div>

    </div>
  );
}
