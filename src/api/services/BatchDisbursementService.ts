import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Logger, LoggerInterface } from '../../decorators/Logger';
import { BDQueryParams } from '../controllers/requests/batchDisbursement';
import { DataNotFoundError } from '../errors/DataNotFoundError';
import { IncorrectApprovalLevelError } from '../errors/IncorrectApprovalLevelError';
import { RequestForbiddenError } from '../errors/RequestForbiddenError';
import { AppUser, AppUserRole } from '../models/AppUser';
import { BatchDisbursement, BDStatus } from '../models/BatchDisbursement';
import { BatchDisbursementRepository } from '../repositories/BatchDisbursementRepository';
import { BusinessRepository } from '../repositories/BusinessRepository';
import { BDApprovalService } from './BDApprovalService';

@Service()
export class BatchDisbursementService {
  constructor(
    @OrmRepository() private bdRepository: BatchDisbursementRepository,
    @OrmRepository() private businessRepository: BusinessRepository,
    @Logger(__filename) private log: LoggerInterface,
    private bdApprovalService: BDApprovalService
  ) {}

  public find(query?: BDQueryParams): Promise<BatchDisbursement[]> {
    this.log.info(`Find all batch disbursements with the given query: ${query}`);
    return this.bdRepository.getByQuery(query);
  }

  public async approve(id: string, status: BDStatus, user: AppUser): Promise<BatchDisbursement> {
    this.log.info('Approving a batch disbursement');
    // Initial Checking if the current action is authorized/correct/allowed
    // Checking if user has correct permissions for the intended approval level
    if (!this.hasApprovalRight(user, status)) throw new RequestForbiddenError();

    // Checking if batch disbursement exists
    const bd = await this.bdRepository.findOne({ id });
    if (!bd) throw new DataNotFoundError();

    // Checking if the intended level of approval needs approval or is the current level of approval
    if (status !== BDStatus.NEEDS_APPROVAL && status !== BDStatus.NEEDS_SECOND_APPROVAL)
      throw new IncorrectApprovalLevelError();
    if (bd.status !== status) throw new IncorrectApprovalLevelError();

    return this.processApproval(bd, user);
  }

  // Create BD Approval Record, Check for Level Restrictions, and Update the Status of DB
  private async processApproval(bd: BatchDisbursement, user: AppUser): Promise<BatchDisbursement> {
    // Create BD Approval record
    await this.bdApprovalService.createBDApprovalRecord(bd, user);

    switch (bd.status) {
      case BDStatus.NEEDS_APPROVAL:
        return this.processFirstLevelApproval(bd, user);
      case BDStatus.NEEDS_SECOND_APPROVAL:
      default:
        return this.processSecondLevelApproval(bd, user);
    }
  }

  private async processFirstLevelApproval(bd: BatchDisbursement, user: AppUser): Promise<BatchDisbursement> {
    // Threshold checking
    const { totalTransactionAmountThreshold: threshold } = await this.businessRepository.findOne(bd.business_id);
    if (bd.totalAmount <= threshold) return this.processSuccessfulApproval(bd, user);
    return this.restrictToNextLevelApproval(bd, BDStatus.NEEDS_SECOND_APPROVAL);
  }

  private processSecondLevelApproval(bd: BatchDisbursement, user: AppUser): Promise<BatchDisbursement> {
    // Create BD Approval record
    return this.processSuccessfulApproval(bd, user);
  }

  private processSuccessfulApproval(bd: BatchDisbursement, user: AppUser): Promise<BatchDisbursement> {
    // Updates the BD record to Pending statue
    const updatedBD = new BatchDisbursement();
    updatedBD.id = bd.id;
    updatedBD.status = BDStatus.PENDING;
    return this.bdRepository.save(updatedBD);
  }

  private restrictToNextLevelApproval(bd: BatchDisbursement, status: BDStatus): Promise<BatchDisbursement> {
    // Updates the BD record to next level
    const updatedBD = new BatchDisbursement();
    updatedBD.id = bd.id;
    updatedBD.status = status;
    return this.bdRepository.save(updatedBD);
  }

  private hasApprovalRight(user: AppUser, status: BDStatus): boolean {
    const { approve_first_level = true, approve_second_level } = user.disbursement_permission;
    // If has Approver Role
    if (user.role !== AppUserRole.APPROVER) return false;
    // If has first level approval permission
    if (status === BDStatus.NEEDS_APPROVAL && !approve_first_level) return false;
    // If has second level approval permission
    if (status === BDStatus.NEEDS_SECOND_APPROVAL && !approve_second_level) return false;
    return true;
  }
}
