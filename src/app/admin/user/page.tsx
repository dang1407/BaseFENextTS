"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ApiUrl from '@/constants/ApiUrl';
import { ApiActionCode } from '@/constants/SharedResources';
import { adm_userDTO, adm_userFilter } from '@/dtos/adminitrations/am_userDTO';
import { PagingInfo } from '@/dtos/BaseDTO';
import adm_user from '@/entities/admin/adm_user';
import { useHandleError } from '@/hooks/useHandleError';
import { useLoading } from '@/components/custom/LoadingContext';
import { ApiService } from '@/utils/api-service';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import Utility from '@/utils/utility';
export default function EmployeeList() {
  const [users, setUsers] = useState<adm_user[]>([]);
  const [filter, setFilter] = useState<adm_userFilter>({});
  const [pagingInfo, setPagingInfo] = useState<PagingInfo>(new PagingInfo());
  const { showLoading, hideLoading } = useLoading();
  const handleError = useHandleError();
  const router = useRouter();
  const pathname = usePathname();

  // Queries
  const { mutate: searchUsers, isPending } = useMutation({
    mutationFn: async (pagingInfo?: PagingInfo) => getUsers(pagingInfo),
    onSuccess: () => { },
    onError: handleError,
  });
  async function getUsers(pagingInfo?: PagingInfo) {
    try {
      showLoading();
      const request = new adm_userDTO();
      request.Filter = filter;
      request.PagingInfo = pagingInfo ?? new PagingInfo();
      const res = await ApiService.post<adm_userDTO>(
        ApiUrl.User,
        ApiActionCode.SearchData,
        request
      );
      setUsers(Utility.AppendSearchResult(users, res.adm_users ?? [], "user_id"));
      setPagingInfo(res.PagingInfo ?? new PagingInfo());
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
    searchUsers(undefined);
  }, []);

  return (
    <div>
        <div className='px-4'>
          <div className='w-full grid grid-cols-3 gap-4 mb-4'>
            <div>
              <Input
                title='Tên người dùng' 
                value={filter.name}
                onChange={(e) => {
                const tempFilter = { ...filter };
                tempFilter.name = e.target.value;
                setFilter(tempFilter);
              }} />
            </div>
            <div></div>
            <div className='flex gap-2'>
            <Button onClick={() => searchUsers(pagingInfo)}>Tìm kiếm</Button>
              <Button onClick={() => router.push(`${pathname}/add`)}>Thêm mới</Button>
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
          <div className='flex justify-center mt-2'>
            <Button onClick={() => loadMore()}>Tải thêm</Button>
          </div>
        </div>
    </div>
  )
}
