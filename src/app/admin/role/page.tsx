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
import { PageTitle } from '@/components/custom/PageTitle';
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
      if(!pagingInfo){
        request.PagingInfo = new PagingInfo();
        request.PagingInfo.PageSize=2000;
        request.PagingInfo.PageIndex=0;
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
      request.AdmRole = {...editingRole};
      const response = await ApiService.post<AdmRoleDTO>(
        ApiUrl.Role,
        ApiActionCode.AddNewItem,
        request
      );
      if(response.AdmRole){
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

  async function loadMore(){
    const nextPaging = {...pagingInfo};
    nextPaging.PageIndex = pagingInfo.PageIndex + 1;
    await getRoles(nextPaging);
  }
  return (
    <div className='px-4'>
      <PageTitle title='Danh sách người dùng' />
      <div className="w-full grid grid-cols-3 gap-4 mb-4'">
        <Input
          title='Tên'
          value={filter.name}
          onChange={(e) => {
            const tempFilter = { ...filter };
            tempFilter.name = e.target.value;
            setFilter(tempFilter);
          }} />
        <div></div>
        <div className='flex gap-2 justify-end'>
          <Button onClick={() => getRoles(pagingInfo)}>Tìm kiếm</Button>
          <Button onClick={() => openRoleForm(new AdmRole(), SharedResource.FormMode.AddNew)}>Thêm mới</Button>
        </div>
      </div>
      <Table className='mt-4'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[40px] text-center'>STT</TableHead>
            <TableHead>Tên nhóm</TableHead>
            <TableHead>Mã nhóm</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            roles.map((role, index) => (
              <TableRow key={`${role.role_id}-${index}`}>
                <TableCell>{index + 1}</TableCell>
                <TableCell onClick={() => openRoleForm(role, SharedResource.FormMode.Edit)}>
                  <span className='text-blue-500 cursor-pointer hover:text-blue-600'>{role.name}</span>
                  </TableCell>
                <TableCell>{role.code}</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
      <div className="w-fule flex justify-center mt-2">
        <Button onClick={() => loadMore()}>Tải thêm</Button>
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
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <div className="w-full grid grid-cols-2 gap-4 mt-4">
          <Input
            value={editingRole?.name ?? ""}
            title="Tên"
            onChange={(e) => {
              if (editingRole)
                setEditingRole({ ...editingRole, name: e.target.value });
            }}
          />
          <Input
            value={editingRole?.code ?? ""}
            title="Mã"
            onChange={(e) => {
              if (editingRole)
                setEditingRole({ ...editingRole, code: e.target.value });
            }}
          />
        </div>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Đóng</Button>
          </DialogClose>
          <Button type="submit" onClick={() => addRole(SharedResource.SaveMode.SaveAndClose)}>Lưu</Button>
          <Button type="submit" onClick={() => addRole(SharedResource.SaveMode.SaveAndAddNewEmpty)}>Lưu và thêm mới</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

}


