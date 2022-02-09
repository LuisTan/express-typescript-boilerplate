import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsUUID, Min, ValidateNested } from 'class-validator';

import { BDStatus } from '../../models/BatchDisbursement';

export class ApproveBDResponseBody {
  @IsUUID()
  @IsNotEmpty()
  public id: string;

  @IsEnum(BDStatus)
  @IsNotEmpty()
  public status: BDStatus;
}

class BaseBatchDisbursement {
  @IsUUID()
  @IsNotEmpty()
  public id: string;

  @IsNotEmpty()
  @IsDate()
  public created_at: Date;

  @IsNotEmpty()
  public reference: string;

  @IsInt()
  @Min(0)
  public totalAmount: number;

  @IsInt()
  @Min(0)
  public totalCount: number;

  @IsEnum(BDStatus)
  @IsNotEmpty()
  public status: BDStatus;

  @IsUUID()
  @IsNotEmpty()
  public uploader_id: string;

  @IsUUID()
  @IsNotEmpty()
  public business_id: string;
}

export class GetBDResponseBody {
  @ValidateNested({ each: true })
  @Type(() => BaseBatchDisbursement)
  public batch_disbursements: BaseBatchDisbursement[];
}
