import { IsNotEmpty, IsString } from 'class-validator';

import { TBDPermissions } from '../../models/AppUser';

export class LoginResponse {
  @IsNotEmpty()
  @IsString()
  public access_token: string;

  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public role: string;

  @IsNotEmpty()
  public permissions: TBDPermissions;

  constructor(token: string) {
    this.access_token = token;
  }
}
