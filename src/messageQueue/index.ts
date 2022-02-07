import { Channel, connect, Connection } from 'amqplib';

import { env } from '../env';

class RMQ {
  private connection: Connection;

  private channel: Channel;

  public async connect() {
    this.connection = await connect(`${env.rmq.protocol}://${env.rmq.host}:${env.rmq.port}`);
    this.channel = await this.connection.createChannel();
    return this;
  }

  public async closeService() {
    await this.connection.close();
    await this.channel.close();
  }

  public getChannel() {
    return this.channel;
  }
}

export default new RMQ();
