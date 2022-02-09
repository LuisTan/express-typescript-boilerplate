import { IsDate, IsEnum, IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { AppUser } from './AppUser';
import { Business } from './Business';

export enum BDStatus {
  NEEDS_APPROVAL = 'NEEDS_APPROVAL',
  NEEDS_SECOND_APPROVAL = 'NEEDS_SECOND_APPROVAL',
  PENDING = 'PENDING',
}

@Entity()
export class BatchDisbursement {
  @IsUUID()
  @IsNotEmpty()
  @PrimaryColumn('uuid')
  public id: string;

  @IsNotEmpty()
  @IsDate()
  @CreateDateColumn({
    name: 'created_at',
  })
  public created_at: Date;

  @ManyToOne(() => AppUser)
  @JoinColumn({ name: 'uploader_id' })
  public uploader: AppUser;

  @ManyToOne(() => Business)
  @JoinColumn({ name: 'business_id' })
  public business: Business;

  @IsNotEmpty()
  @Column()
  public reference: string;

  @IsInt()
  @Min(0)
  @Column({ name: 'total_uploaded_amount', type: 'integer' })
  public totalAmount: number;

  @IsInt()
  @Min(0)
  @Column({ name: 'total_uploaded_count', type: 'integer' })
  public totalCount: number;

  @IsEnum(BDStatus)
  @IsNotEmpty()
  @Column({
    type: 'enum',
    enum: BDStatus,
    default: BDStatus.NEEDS_APPROVAL,
  })
  public status: BDStatus;

  @IsUUID()
  @IsNotEmpty()
  @Column()
  public uploader_id: string;

  @IsUUID()
  @IsNotEmpty()
  @Column()
  public business_id: string;
}
