/* eslint-disable no-console */
import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post, QueryParams } from 'routing-controllers';

import { AppUser, AppUserRole } from '../models/AppUser';
import { BatchDisbursementService } from '../services/BatchDisbursementService';
import { ApproveBDBody, GetBDQuery } from './requests/batchDisbursement';
import { ApproveBDResponseBody, GetBDResponseBody } from './responses/batchDisbursement';

@JsonController('/batch_disbursements')
export class BatchDisbursementController {
  constructor(private bdService: BatchDisbursementService) {}

  @Authorized([AppUserRole.VIEWER, AppUserRole.APPROVER])
  @Get()
  public async find(
    @CurrentUser({ required: true }) currentUser: AppUser,
    @QueryParams() query: GetBDQuery
  ): Promise<GetBDResponseBody> {
    const { status } = query;
    const { business_id } = currentUser;
    const res = new GetBDResponseBody();
    res.batch_disbursements = await this.bdService.find({ business_id, status });
    return res;
  }

  @Authorized([AppUserRole.APPROVER])
  @Post('/approve/:id')
  public async approve(
    @CurrentUser({ required: true }) currentUser: AppUser,
    @Param('id') id: string,
    @Body({ required: true }) body: ApproveBDBody
  ): Promise<ApproveBDResponseBody> {
    const { status } = body;
    const updatedBD = await this.bdService.approve(id, status, currentUser);
    const res = new ApproveBDResponseBody();
    res.id = updatedBD.id;
    res.status = updatedBD.status;
    return res;
  }
}
