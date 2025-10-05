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

export default function EmployeeList() {
  const [users, setUsers] = useState<adm_user[]>([]);
  const [filter, setFilter] = useState<adm_userFilter>({});
  const [pagingInfo, setPagingInfo] = useState<PagingInfo>(new PagingInfo());
  const { isLoading, showLoading, hideLoading } = useLoading();
  const handleError = useHandleError();

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
    const nextPage = {...pagingInfo};
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
          <div className='w-full h-16'>
            <div className='flex'>
            <Input onChange={(e) => {
              const tempFilter = { ...filter };
              tempFilter.name = e.target.value;
              setFilter(tempFilter);
            }} />
            <Button onClick={() => getUsers()}>Tìm kiếm</Button>
            </div>
          </div>
          {
            users.length > 0 &&
            <Table>
              <TableHeader>
                <TableRow className='text-[#000]'>
                  <TableHead className='w-[40px] text-center'>STT</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>SĐT</TableHead>
                  <TableHead>Giới tính</TableHead>
                  <TableHead>Ngày sinh</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{
                users.map((user, index) => (
                  <TableRow key={user.user_id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.code}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>{user.dob?.toString()}</TableCell>
                  </TableRow>
                ))
              }
              </TableBody>
            </Table>
          }
        </div>
      }
    </div>
  )
}
