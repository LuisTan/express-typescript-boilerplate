import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequest {
  @IsNotEmpty({ message: 'name is required' })
  @IsString({ message: 'name should be string' })
  public name: string;
}
