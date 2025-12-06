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
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='bg-white rounded-lg shadow-sm p-6'>
          {/* Header */}
          <div className='mb-6'>
            <h1 className='text-2xl font-bold text-gray-800'>Danh sách người dùng</h1>
            <p className='text-sm text-gray-500 mt-1'>Quản lý thông tin người dùng hệ thống</p>
          </div>

          {/* Search and Actions */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
            <div className='md:col-span-2'>
              <Input
                placeholder='Tìm kiếm theo tên, email, số điện thoại...'
                value={filter.name}
                onChange={(e) => {
                  const tempFilter = { ...filter };
                  tempFilter.name = e.target.value;
                  setFilter(tempFilter);
                }}
                className='h-10 border-gray-300 focus:border-green-500 focus:ring-green-500'
              />
            </div>
            <div className='flex gap-2'>
              <Button
                onClick={() => searchUsers(new PagingInfo())}
                className='flex-1 bg-green-600 hover:bg-green-700 text-white h-10'
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Tìm kiếm
              </Button>
              <Button
                onClick={() => router.push(`${pathname}/add`)}
                className='flex-1 bg-green-600 hover:bg-green-700 text-white h-10'
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm mới
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className='overflow-x-auto rounded-lg border border-gray-200'>
            <Table>
              <TableHeader>
                <TableRow className='bg-gray-50 border-b border-gray-200'>
                  <TableHead className='w-[60px] text-center font-semibold text-gray-700'>STT</TableHead>
                  <TableHead className='font-semibold text-gray-700'>Họ và tên</TableHead>
                  <TableHead className='font-semibold text-gray-700'>Code</TableHead>
                  <TableHead className='font-semibold text-gray-700'>Username</TableHead>
                  <TableHead className='font-semibold text-gray-700'>Email</TableHead>
                  <TableHead className='font-semibold text-gray-700'>SĐT</TableHead>
                  <TableHead className='font-semibold text-gray-700'>Giới tính</TableHead>
                  <TableHead className='font-semibold text-gray-700'>Ngày sinh</TableHead>
                </TableRow>
              </TableHeader>
              {users.length > 0 ? (
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow
                      key={user.user_id}
                      className='hover:bg-gray-50 transition-colors border-b border-gray-100'
                    >
                      <TableCell className='text-center text-gray-600'>{index + 1}</TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/user/display/${user.user_id}`}
                          className="text-green-600 hover:text-green-700 font-medium hover:underline"
                        >
                          {user.name}
                        </Link>
                      </TableCell>
                      <TableCell className='text-gray-600'>{user.code}</TableCell>
                      <TableCell className='text-gray-600'>{user.username}</TableCell>
                      <TableCell className='text-gray-600'>{user.email}</TableCell>
                      <TableCell className='text-gray-600'>{user.phone}</TableCell>
                      <TableCell className='text-gray-600'>{user.gender}</TableCell>
                      <TableCell className='text-gray-600'>{user.dob?.toString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={8} className='text-center py-8 text-gray-500'>
                      <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      Không tìm thấy dữ liệu
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </div>

          {/* Load More */}
          {pagingInfo?.PageIndex !== undefined && pagingInfo?.PageSize !== undefined && (
            <div className='flex justify-center mt-6'>
              <Button
                onClick={() => loadMore()}
                disabled={isPending}
                className='bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 px-8'
              >
                {isPending ? 'Đang tải...' : 'Tải thêm'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
