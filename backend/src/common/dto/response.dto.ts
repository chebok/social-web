export class ResponseDto<T = any> {
  status: number;

  message: string;

  data?: T;
}
