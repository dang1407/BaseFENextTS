export class PagingInfo {
  public PageIndex: number = 0;
  public PageSize: number = 20;
}

export class BaseDTO {
  public FunctionCodes?: string[];
  public PagingInfo?: PagingInfo;
}