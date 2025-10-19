import AdmRole from '@/entities/admin/AdmRole';
import { BaseDTO } from '@/dtos/BaseDTO';

export default class AdmRoleDTO extends BaseDTO {
  public RoleId?: number;
  public AdmRole?: AdmRole;
  public AdmRoles?: AdmRole[];
  public Filter?: AdmRoleFilter;
}

export class AdmRoleFilter {
  public name?: string;
  public code?: string;
}
