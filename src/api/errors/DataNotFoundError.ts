import { HttpError } from 'routing-controllers';

export class DataNotFoundError extends HttpError {
  constructor() {
    super(404, 'DataNotFoundError');
  }
}
