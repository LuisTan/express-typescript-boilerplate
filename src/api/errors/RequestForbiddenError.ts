import { HttpError } from 'routing-controllers';

export class RequestForbiddenError extends HttpError {
  constructor() {
    super(403, 'RequestForbiddenError');
  }
}
