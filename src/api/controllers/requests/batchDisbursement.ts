import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

import { BDStatus } from '../../models/BatchDisbursement';

export class ApproveBDBody {
  @IsNotEmpty()
  @IsEnum(BDStatus)
  public status: BDStatus;
}

export class GetBDQuery {
  @IsEnum(BDStatus, { each: true })
  @IsOptional()
  public status: BDStatus[];
}

export class BDQueryParams extends GetBDQuery {
  @IsUUID()
  @IsOptional()
  public business_id: string;
}
