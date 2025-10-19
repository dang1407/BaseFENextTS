export default class AdmRole {
    public role_id? : number; 
    public name? : string; 
    public code? : string; 
    public description? : string; 
    public is_public? : boolean; 
    public is_system? : boolean; 
    public is_active? : boolean; 
    public fixed_right_codes? : string; 
    public version? : number; 
    public deleted? : number; 
    public created_dtg? : Date | string; 
    public created_by? : string; 
    public updated_dtg? : Date | string; 
    public updated_by? : string; 
}
