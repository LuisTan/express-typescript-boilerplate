import { EventSubscriber, On } from 'event-dispatch';

import { Logger } from '../../lib/logger';
import { AppUserService } from '../services/AppUserService';
import { RMQService } from '../services/RMQService';
import { TSampleObject, TSampleSend } from './eventObjects';
import { events } from './events';

const log = new Logger(__filename);

@EventSubscriber()
export class SampleEventSubscriber {
  constructor(private userService: AppUserService, private rmqService: RMQService) {}

  @On(events.sample.call)
  public onCall(sample: TSampleObject): void {
    log.info(`Sample Event called with ${sample.toString()} data`);
    this.userService.sample();
  }

  @On(events.sample.send)
  public onSend(sample: TSampleSend): void {
    log.info(`Sample Event onSend called with ${sample.toString()} data`);
    this.rmqService.produce(sample.queue, sample.data);
  }
}
