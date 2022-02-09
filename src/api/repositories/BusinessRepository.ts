import { EntityRepository, Repository } from 'typeorm';

import { Business } from '../models/Business';

@EntityRepository(Business)
export class BusinessRepository extends Repository<Business> {}
