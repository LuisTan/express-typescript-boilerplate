import { IsDate, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { AppUser } from './AppUser';
import { BatchDisbursement } from './BatchDisbursement';

export enum BDApprovalType {
  FIRST_LEVEL = 'FIRST_LEVEL',
  SECOND_LEVEL = 'SECOND_LEVEL',
}

@Entity()
export class BDApproval {
  @IsUUID()
  @IsNotEmpty()
  @PrimaryColumn('uuid')
  public id: string;

  @ManyToOne(() => AppUser)
  @JoinColumn({ name: 'approver_id' })
  public approver: AppUser;

  @IsUUID()
  @IsNotEmpty()
  @Column()
  public approver_id: string;

  @ManyToOne(() => BatchDisbursement)
  @JoinColumn({ name: 'batch_disbursement_id' })
  public batchDisbursement: BatchDisbursement;

  @IsEnum(BDApprovalType)
  @IsNotEmpty()
  @Column({
    type: 'enum',
    enum: BDApprovalType,
    default: BDApprovalType.FIRST_LEVEL,
  })
  public type: BDApprovalType;

  @IsNotEmpty()
  @IsDate()
  @CreateDateColumn({ name: 'approved_at' })
  public approved_at: Date;
}
