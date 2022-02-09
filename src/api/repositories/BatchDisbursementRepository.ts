import { EntityRepository, FindConditions, In, Repository } from 'typeorm';

import { BDQueryParams } from '../controllers/requests/batchDisbursement';
import { BatchDisbursement } from '../models/BatchDisbursement';

@EntityRepository(BatchDisbursement)
export class BatchDisbursementRepository extends Repository<BatchDisbursement> {
  public getByQuery(query: BDQueryParams): Promise<BatchDisbursement[]> {
    const sqlFindConditions: FindConditions<BatchDisbursement> = {};
    const { business_id, status } = query;
    if (business_id) sqlFindConditions.business_id = business_id;
    if (status) sqlFindConditions.status = In(status);
    return this.find(sqlFindConditions);
  }
}
