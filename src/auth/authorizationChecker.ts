import { Action } from 'routing-controllers';
import { Container } from 'typedi';
import { Connection } from 'typeorm';

import { env } from '../env';
import { Logger } from '../lib/logger';
import { AuthOService } from './AuthOService';

export function authorizationChecker(
  connection: Connection
): (action: Action, roles: any[]) => Promise<boolean> | boolean {
  const log = new Logger(__filename);
  const authOService = Container.get<AuthOService>(AuthOService);
  if (!env.auth.jwt.enabled) return (): boolean => true;

  return async function innerJWTAuthorizationChecker(action: Action, roles: string[]): Promise<boolean> {
    const token = await authOService.parseJWTToken(action.request);
    if (!token) {
      log.warn('No token given');
      return false;
    }
    action.request.user = await authOService.verifyTokenAndRetrieveUser(token);
    if (action.request.user === undefined) {
      log.warn('No user retrieved');
      return false;
    }
    if (!roles.length) return true;
    return roles.includes(action.request.user.role);
  };
}
