import adm_user from "@/entities/admin/adm_user";
import { BaseDTO } from '@/dtos/BaseDTO';

class adm_userDTO extends BaseDTO {
  public adm_userId?: number;

  public adm_user?: adm_user;

  public adm_users?: Array<adm_user>;

  public Filter?: adm_userFilter;

  public user_id?: number;
}

class adm_userFilter {
  public username?: string;
  public name?: string;
  public gender?: number;
  public dob_from?: Date;
}

export { adm_userDTO, adm_userFilter }
