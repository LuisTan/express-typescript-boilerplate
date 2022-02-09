import { JSend, JSendStatus } from './jsend';

export interface JSendErrorData {
  name: string;
}

export class JSendError extends JSend<unknown, JSendErrorData> {
  constructor(obj: JSendErrorData, code: number) {
    super(JSendStatus.Error);
    this.code = code;
    this.error = obj;
  }
}
