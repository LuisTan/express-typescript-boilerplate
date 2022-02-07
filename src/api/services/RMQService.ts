import { Channel, ConsumeMessage } from 'amqplib';
import { Service } from 'typedi';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import RMQ from '../../messageQueue';

@Service()
export class RMQService {
  private channel: Channel;

  constructor(
    @Logger(__filename) private log: LoggerInterface,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface
  ) {
    this.channel = RMQ.getChannel();
  }

  public produce(queue: string, message: string) {
    this.channel.sendToQueue(queue, Buffer.from(message));
    this.log.info(`Sent message to Queue: ${queue}`);
  }

  public async consume(queue: string, event: string) {
    await this.channel.consume(queue, (msg) => {
      this.log.info(`Received message from Queue: ${queue}. Dispatching event: ${event}`);
      this.eventDispatcher.dispatch(event, JSON.parse(msg.content.toString()));
    });
  }
}
