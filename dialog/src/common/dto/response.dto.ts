export class ResponseDto<T = any> {
  status: number;
  message: string;
  data?: T;

  constructor(status: number, message: string, data?: T) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  toString() {
    return JSON.stringify({
      status: this.status,
      message: this.message,
      data: this.data,
    });
  }
}
