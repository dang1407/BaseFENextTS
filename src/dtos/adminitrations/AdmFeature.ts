export default class AdmFeature {
  public feature_id?: number;
  public name?: string;
  public parent_id?: number;
  public permission_group?: number;
  public status?: number;
  public description?: string;
  public url?: string;
  public is_visible?: number;
  public display_order?: number;
  public icon?: string;
  public version?: number;
  public deleted?: number;
  public created_dtg?: Date | string;
  public updated_dtg?: Date | string;
  public created_by?: number;
  public updated_by?: number;
}
