"use client"
import { useLoading } from '@/components/custom/LoadingContext'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import ApiUrl from '@/constants/ApiUrl';
import { ApiActionCode, FormModeValue, SaveModeValue, SharedResource } from '@/constants/SharedResources';
import AdmRoleDTO, { AdmRoleFilter } from '@/dtos/adminitrations/AdmRoleDTO';
import { PagingInfo } from '@/dtos/BaseDTO';
import AdmRole from '@/entities/admin/AdmRole';
import { useHandleError } from '@/hooks/useHandleError';
import { ApiService } from '@/utils/api-service';
import Utility from '@/utils/utility';
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input';

export default function RoleList() {
  const [roles, setRoles] = useState<AdmRole[]>([]);
  const [pagingInfo, setPagingInfo] = useState<PagingInfo>(new PagingInfo());
  const [isShowEditForm, setIsShowEditForm] = useState<boolean>(false);
  const [editingRole, setEditingRole] = useState<AdmRole>();
  const [filter, setFilter] = useState<AdmRoleFilter>(new AdmRoleFilter());
  const loadingManager = useLoading();
  const errorHandler = useHandleError();

  async function getRoles(pagingInfo?: PagingInfo) {
    try {
      loadingManager.showLoading();
      const request = new AdmRoleDTO();
      request.PagingInfo = pagingInfo;
      if (!pagingInfo) {
        request.PagingInfo = new PagingInfo();
        request.PagingInfo.PageIndex = 0;
      }
      request.Filter = filter;
      const response = await ApiService.post<AdmRoleDTO>(
        ApiUrl.Role,
        ApiActionCode.SearchData,
        request
      );
      setRoles(Utility.AppendSearchResult(roles, response.AdmRoles ?? [], "role_id"));
      setPagingInfo(response.PagingInfo ?? new PagingInfo());
    } catch (error: any) {
      errorHandler(error);
    } finally {
      loadingManager.hideLoading();
    }
  }

  async function addRole(saveMode: SaveModeValue) {
    try {
      loadingManager.showLoading();
      const request = new AdmRoleDTO();
      request.AdmRole = { ...editingRole };
      const response = await ApiService.post<AdmRoleDTO>(
        ApiUrl.Role,
        ApiActionCode.AddNewItem,
        request
      );
      if (response.AdmRole) {
        setRoles(Utility.AppendSearchResult(roles, [response.AdmRole], "role_id"));
        switch (saveMode) {
          case SharedResource.SaveMode.SaveAndClose:
            setIsShowEditForm(false);
            break;
          case SharedResource.SaveMode.SaveAndAddNewEmpty:
            setEditingRole(new AdmRole());
            break;
          case SharedResource.SaveMode.SaveAndCopy:
            const copyRole = { ...editingRole };
            copyRole.role_id = undefined;
            setEditingRole(copyRole)
            break;
        }
      }
    } catch (error: any) {
      errorHandler(error);
    } finally {
      loadingManager.hideLoading();
    }
  }

  function openRoleForm(role: AdmRole, mode: FormModeValue) {
    setIsShowEditForm(true);
    setEditingRole(role);
  }

  useEffect(() => {
    getRoles();
  }, []);

  async function loadMore() {
    const nextPaging = { ...pagingInfo };
    nextPaging.PageIndex = pagingInfo.PageIndex + 1;
    await getRoles(nextPaging);
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto'>
        <div className='bg-white rounded-lg shadow-sm'>
          {/* Header */}
          <div className='mb-6'>
            <h1 className='text-2xl font-bold text-gray-800'>Danh sách nhóm người dùng</h1>
            <p className='text-sm text-gray-500 mt-1'>Quản lý nhóm quyền và vai trò trong hệ thống</p>
          </div>

          {/* Search and Actions */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
            <div className='md:col-span-2'>
              <Input
                placeholder='Tìm kiếm theo tên hoặc mã nhóm...'
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
                onClick={() => getRoles(new PagingInfo())}
                className='flex-1 bg-green-600 hover:bg-green-700 text-white h-10'
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Tìm kiếm
              </Button>
              <Button
                onClick={() => openRoleForm(new AdmRole(), SharedResource.FormMode.AddNew)}
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
                  <TableHead className='font-semibold text-gray-700'>Tên nhóm</TableHead>
                  <TableHead className='font-semibold text-gray-700'>Mã nhóm</TableHead>
                </TableRow>
              </TableHeader>
              {roles.length > 0 ? (
                <TableBody>
                  {roles.map((role, index) => (
                    <TableRow
                      key={`${role.role_id}-${index}`}
                      className='hover:bg-gray-50 transition-colors border-b border-gray-100'
                    >
                      <TableCell className='text-center text-gray-600'>{index + 1}</TableCell>
                      <TableCell>
                        <span
                          className='text-green-600 cursor-pointer hover:text-green-700 font-medium hover:underline'
                          onClick={() => openRoleForm(role, SharedResource.FormMode.Edit)}
                        >
                          {role.name}
                        </span>
                      </TableCell>
                      <TableCell className='text-gray-600'>{role.code}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={3} className='text-center py-8 text-gray-500'>
                      <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Không tìm thấy dữ liệu
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </div>

          {/* Load More */}
          {pagingInfo?.PageIndex !== undefined && pagingInfo?.PageSize !== undefined && roles.length >= pagingInfo.PageSize && (
            <div className='flex justify-center mt-6'>
              <Button
                onClick={() => loadMore()}
                className='bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 px-8'
              >
                Tải thêm
              </Button>
            </div>
          )}
        </div>
      </div>
      {roleForm()}
    </div>
  )

  function roleForm() {
    const title = editingRole?.role_id
      ? "Chỉnh sửa nhóm quyền"
      : "Thêm nhóm quyền mới";

    return (
      <Dialog open={isShowEditForm} onOpenChange={setIsShowEditForm}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogTitle className='text-xl font-bold text-gray-800'>{title}</DialogTitle>
          <div className="grid grid-cols-1 gap-4 mt-4">
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>
                Tên nhóm <span className='text-red-500'>*</span>
              </label>
              <Input
                value={editingRole?.name ?? ""}
                placeholder="Nhập tên nhóm quyền"
                onChange={(e) => {
                  if (editingRole)
                    setEditingRole({ ...editingRole, name: e.target.value });
                }}
                className='h-10 border-gray-300 focus:border-green-500 focus:ring-green-500'
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>
                Mã nhóm <span className='text-red-500'>*</span>
              </label>
              <Input
                value={editingRole?.code ?? ""}
                placeholder="Nhập mã nhóm quyền"
                onChange={(e) => {
                  if (editingRole)
                    setEditingRole({ ...editingRole, code: e.target.value });
                }}
                className='h-10 border-gray-300 focus:border-green-500 focus:ring-green-500'
              />
            </div>
          </div>
          <DialogFooter className="mt-6 gap-2">
            <DialogClose asChild>
              <Button variant="outline" className='border-gray-300 text-gray-700 hover:bg-gray-50'>
                Đóng
              </Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={() => addRole(SharedResource.SaveMode.SaveAndClose)}
              className='bg-green-600 hover:bg-green-700 text-white'
            >
              Lưu
            </Button>
            <Button
              type="submit"
              onClick={() => addRole(SharedResource.SaveMode.SaveAndAddNewEmpty)}
              className='bg-green-600 hover:bg-green-700 text-white'
            >
              Lưu và thêm mới
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
}
