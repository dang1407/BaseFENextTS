export default class adm_feature {
  public feature_id?: number;
  public name?: string;
  public parent_id?: number;
  public active?: boolean;
  public description?: string;
  public display_order?: number;
  public url?: string;
  public on_mobile?: number;
  public is_visible?: number;
  public icon?: string;
  public target?: string;

  // Extend
  public children?: Array<adm_feature>;
}