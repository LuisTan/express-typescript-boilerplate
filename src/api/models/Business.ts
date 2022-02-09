import { IsAlpha, IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Business {
  @IsUUID()
  @IsNotEmpty()
  @PrimaryColumn('uuid')
  public id: string;

  @IsAlpha()
  @Column()
  public name: string;

  @IsInt()
  @Min(0)
  @Column({ name: 'total_transaction_amount_threshold', type: 'integer' })
  public totalTransactionAmountThreshold: number;
}
