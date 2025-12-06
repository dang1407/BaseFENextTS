export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7241/api/v1/';
export default class ApiUrl {
  public static GetEncryptData: string = BASE_URL + "Authenticate/GetEncryptData";
  public static Login: string = BASE_URL + "Authenticate/login";
  public static ReLogin: string = BASE_URL + "Authenticate/refresh-token";
  public static SignUp: string = BASE_URL + "Authenticate/sign-up";
  public static User: string = BASE_URL + "User";
  public static Role: string = BASE_URL + "Role";
  public static UserTest: string = BASE_URL + "User/Test";
  public static GetUserMenu: string = BASE_URL + "UI/UserMenu";

  // Booking & CarTrip endpoints
  public static Booking: string = BASE_URL + "Booking";
  public static CarTrip: string = BASE_URL + "CarTrip";
}