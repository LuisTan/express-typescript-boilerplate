import { HttpError } from 'routing-controllers';

export class IncorrectApprovalLevelError extends HttpError {
  constructor() {
    super(400, 'IncorrectApprovalLevelError');
  }
}
