import { EntityRepository, Repository } from 'typeorm';

import { BDApproval } from '../models/BDApproval';

@EntityRepository(BDApproval)
export class BDApprovalRepository extends Repository<BDApproval> {}
