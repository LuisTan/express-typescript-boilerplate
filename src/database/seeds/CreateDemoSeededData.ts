import { Connection } from 'typeorm/connection/Connection';
import { Factory, Seed, times } from 'typeorm-seeding';
import uuid from 'uuid';

import { AppUser, AppUserRole } from '../../api/models/AppUser';
import { BatchDisbursement, BDStatus } from '../../api/models/BatchDisbursement';
import { Business } from '../../api/models/Business';

export class CreateDemoSeededData implements Seed {
  public async seed(factory: Factory, connection: Connection): Promise<void> {
    const em = connection.createEntityManager();

    // Create Business
    const bsns = new Business();
    bsns.id = uuid.v1();
    bsns.name = 'Sample Business';
    bsns.totalTransactionAmountThreshold = 10000;
    const business = await em.save(bsns);

    // Viewer User
    const users = [];
    const viewer = new AppUser();
    viewer.id = uuid.v1();
    viewer.name = 'Viewer';
    viewer.role = AppUserRole.VIEWER;
    viewer.business = business;
    users.push(em.save(viewer));

    // First Level Approver User
    const firstUser = new AppUser();
    firstUser.id = uuid.v1();
    firstUser.name = 'First Level';
    firstUser.role = AppUserRole.APPROVER;
    firstUser.business = business;
    users.push(em.save(firstUser));

    // Second Level Approver User
    const secondUser = new AppUser();
    secondUser.id = uuid.v1();
    secondUser.name = 'Second Level';
    secondUser.role = AppUserRole.APPROVER;
    secondUser.business = business;
    secondUser.disbursement_permission = {
      approve_second_level: true,
    };
    users.push(em.save(secondUser));

    // Second Level Only Approver User (Just in Case)
    const secondOnlyUser = new AppUser();
    secondOnlyUser.id = uuid.v1();
    secondOnlyUser.name = 'Second Only Level';
    secondOnlyUser.role = AppUserRole.APPROVER;
    secondOnlyUser.business = business;
    secondOnlyUser.disbursement_permission = {
      approve_first_level: false,
      approve_second_level: true,
    };
    users.push(em.save(secondOnlyUser));

    await Promise.all(users);

    // Creating Template for the Trial
    const templateBD = new BatchDisbursement();
    templateBD.totalAmount = 1000;
    templateBD.totalCount = 10;
    templateBD.uploader = viewer;
    templateBD.business = business;
    templateBD.status = BDStatus.NEEDS_APPROVAL;

    await times(10, async (n) => {
      templateBD.id = uuid.v1();
      if (n % 2 === 0) {
        // First Level BD (Exceed)
        templateBD.reference = `Exceeded ${n}`;
        templateBD.totalAmount = 20000;
      }
      // First Level BD (Not Exceed)
      templateBD.reference = `Not Exceeded ${n}`;
      templateBD.totalAmount = 1000;
      return em.save(templateBD);
    });
  }
}
