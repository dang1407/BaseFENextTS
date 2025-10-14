export default class AdmClientAuthenticate {
    public client_authenticate_id? : number; 
    public request_id? : number | null; 
    public public_key? : string | null; 
    public private_key? : string | null; 
    public requested_dtg? : Date | string | null; 
    public expiried_dtg? : Date | string | null; 
    public used_dtg? : Date | string | null; 
    public requested_by? : number | null; 
    public client_ip? : string | null; 
}
