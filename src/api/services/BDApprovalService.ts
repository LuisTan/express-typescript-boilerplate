import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { AppUser } from '../models/AppUser';
import { BatchDisbursement, BDStatus } from '../models/BatchDisbursement';
import { BDApproval, BDApprovalType } from '../models/BDApproval';
import { BDApprovalRepository } from '../repositories/BDApprovalRepository';

@Service()
export class BDApprovalService {
  constructor(
    @OrmRepository() private bdApprovalRepository: BDApprovalRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  public createBDApprovalRecord(bd: BatchDisbursement, user: AppUser): Promise<BDApproval> {
    this.log.info(`Create BD Approval record.`);
    // Creates the BD Approval record
    const bdApproval = new BDApproval();
    bdApproval.id = uuid.v1();
    bdApproval.batchDisbursement = bd;
    bdApproval.approver = user;
    if (bd.status === BDStatus.NEEDS_APPROVAL) bdApproval.type = BDApprovalType.FIRST_LEVEL;
    if (bd.status === BDStatus.NEEDS_SECOND_APPROVAL) bdApproval.type = BDApprovalType.SECOND_LEVEL;
    return this.bdApprovalRepository.save(bdApproval);
  }
}
