class ApiActionCode {
  static SearchData : string = "SearchData"; 
  static UpdateItem: string = "UpdateItem";
  static AddNewItem: string = "AddNewItem";
  static SetupDisplay: string = "SetupDisplay";
  static SetupUpdateForm: string = "SetupUpdateForm";
}

class SharedResource {
  public static FormMode = class {
    static AddNew = 1;
    static Display = 2;
    static Edit = 3;
  }
  public static SaveMode = class {
    static SaveAndClose = 1;
    static SaveAndAddNewEmpty = 2;
    static SaveAndCopy = 3;
  }
}

export type FormModeValue = (typeof SharedResource.FormMode)[keyof typeof SharedResource.FormMode];
export type SaveModeValue = (typeof SharedResource.SaveMode)[keyof typeof SharedResource.SaveMode];

export {ApiActionCode, SharedResource};