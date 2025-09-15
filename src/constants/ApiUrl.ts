const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7241/api/v1/';
export default class ApiUrl {
  public static Login : string = BASE_URL +  "Authenticate/login";
  public static ReLogin : string = BASE_URL +  "Authenticate/relogin";
  public static SignUp : string = BASE_URL +  "Authenticate/sign-up";
  public static User : string = BASE_URL +  "User";
  public static GetUserMenu : string = BASE_URL + "UI/UserMenu";
}