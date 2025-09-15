"use client";
import { useState } from "react";

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
export default function CreateUser() {
  const [user, setUser] = useState<adm_user>({});
  const handleError = useHandleError();
  async function createUser() {
    try {
      if(FieldValidator.HasError()){
        throw new Error("Lỗi thông tin đã nhập");
      }
      const request = new adm_userDTO();
      request.adm_user = user;
      const response = await ApiService.post<adm_userDTO>(
        ApiUrl.User,
        "AddNewItem",
        request
      );
      // console.log(response);
    } catch (error: any) {
      handleError(error);
    }
  }
  return (
    <div className="">
      <PageTitle title='Thêm mới người dùng'/>
      <form>
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col space-y-1.5">
            <Input required title='Họ và tên' id="name" placeholder="Name" onChange={(e) => setUser((prevUser) => ({ ...prevUser, name: e.target.value }))} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Input title='Mã' id="code" placeholder="Code" onChange={(e) => setUser((prevUser) => ({ ...prevUser, code: e.target.value }))} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Input required title='Tên đăng nhập' id="username" placeholder="Username" onChange={(e) => setUser((prevUser) => ({ ...prevUser, username: e.target.value }))} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Input required title='Mật khẩu' id="password" placeholder="Password" onChange={(e) => setUser((prevUser) => ({ ...prevUser, password: e.target.value }))} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Input required title='Nhập lại mật khẩu' id="confirm-password" placeholder="Confirm password" onChange={(e) => setUser((prevUser) => ({ ...prevUser, confim_password: e.target.value }))} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="date-of-birth">Ngày sinh</Label>
            <DateTimePicker value={user.dob} mode="date"
              onChange={(d) => setUser((prevUser) => ({ ...prevUser, dob: d }))}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Input title='Email' id="email" placeholder="Email" onChange={(e) => setUser((prevUser) => ({ ...prevUser, email: e.target.value }))} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Input title='Số điện thoại' id="phone" placeholder="Phone" onChange={(e) => setUser((prevUser) => ({ ...prevUser, phone: e.target.value }))} />
          </div>
        </div>
      </form>
      <Button className='mt-4' onClick={() => createUser()} >Thêm mới</Button>
    </div>
  );
}
