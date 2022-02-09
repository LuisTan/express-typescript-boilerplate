import { IsAlpha, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Business } from './Business';

export enum AppUserRole {
  VIEWER = 'VIEWER',
  APPROVER = 'APPROVER',
}

export interface TBDPermissions {
  approve_first_level?: boolean;
  approve_second_level?: boolean;
}

@Entity({ name: 'app_user' })
export class AppUser {
  @IsUUID()
  @IsNotEmpty()
  @PrimaryColumn('uuid')
  public id: string;

  @IsNotEmpty()
  @IsAlpha()
  @Column()
  public name: string;

  @IsEnum(AppUserRole)
  @IsNotEmpty()
  @Column({
    type: 'enum',
    enum: AppUserRole,
    default: AppUserRole.VIEWER,
  })
  public role: AppUserRole;

  @IsUUID()
  @IsNotEmpty()
  @Column()
  public business_id: string;

  @ManyToOne(() => Business)
  @JoinColumn({ name: 'business_id' })
  public business: Business;

  @IsNotEmpty()
  @Column('jsonb', { default: {} })
  public disbursement_permission: TBDPermissions;

  public toString(): string {
    return `${this.name}`;
  }
}
