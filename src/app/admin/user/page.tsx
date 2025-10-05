"use client";
import Loading from '@/components/custom/Loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ApiUrl from '@/constants/ApiUrl';
import { ApiActionCode } from '@/constants/SharedResources';
import { adm_userDTO, adm_userFilter } from '@/dtos/am_userDTO';
import { PagingInfo } from '@/dtos/BaseDTO';
import adm_user from '@/entities/adm_user';
import { useHandleError } from '@/hooks/useHandleError';
import { useLoading } from '@/hooks/useUIManage';
import { ApiService } from '@/utils/api-service';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
export default function EmployeeList() {
  const [users, setUsers] = useState<adm_user[]>([]);
  const [filter, setFilter] = useState<adm_userFilter>({});
  const [pagingInfo, setPagingInfo] = useState<PagingInfo>(new PagingInfo());
  const { isLoading, showLoading, hideLoading } = useLoading();
  const handleError = useHandleError();
  const router = useRouter();
  const pathname = usePathname();
  async function getUsers(pagingInfo?: PagingInfo) {
    try {
      showLoading();
      const request = new adm_userDTO();
      request.Filter = filter;
      request.PagingInfo = pagingInfo ?? new PagingInfo();
      const res = await ApiService.post<adm_userDTO>(
        ApiUrl.User,
        ApiActionCode.SearchData,
        JSON.stringify(request)
      );
      setUsers(res.adm_users ?? []);
    } catch (error: any) {
      handleError(error);
    } finally {
      hideLoading();
    }
  }

  async function loadMore() {
    const nextPage = { ...pagingInfo };
    nextPage.PageIndex = nextPage.PageIndex + 1;
    await getUsers(nextPage);
  }
  useEffect(() => {

    getUsers();
  }, []);

  return (
    <div>
      {
        isLoading &&
        <Loading />
      }
      {
        <div className='px-4'>
          <div className='w-full grid grid-cols-3 gap-4 mb-4'>
            <div>
              <Input
                title='Tên người dùng' 
                onChange={(e) => {
                const tempFilter = { ...filter };
                tempFilter.name = e.target.value;
                setFilter(tempFilter);
              }} />
            </div>
            <div></div>
            <div className='flex gap-2'>
            <Button onClick={() => getUsers()}>Tìm kiếm</Button>
              <Button onClick={() => router.push(`${pathname}/create`)}>Thêm mới</Button>
            </div>
            <div>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className='text-[#000]'>
                <TableHead className='w-[40px] text-center'>STT</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>SĐT</TableHead>
                <TableHead>Giới tính</TableHead>
                <TableHead>Ngày sinh</TableHead>
              </TableRow>

            </TableHeader>
            {
              users.length > 0 &&
              <TableBody>{
                users.map((user, index) => (
                  <TableRow key={user.user_id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Link href={`/admin/user/display/${user.user_id}`} className="text-blue-500 hover:text-blue-800">{user.name}</Link>
                    </TableCell>
                    <TableCell>{user.code}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>{user.dob?.toString()}</TableCell>
                  </TableRow>
                ))
              }
              </TableBody>
            }

          </Table>
        </div>
      }
    </div>
  )
}
