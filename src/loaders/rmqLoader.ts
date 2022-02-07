import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';

import { env } from '../env';
import RMQ from '../messageQueue';

export const rmqLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
  const channel = await (await RMQ.connect()).getChannel();

  // Assert all queues
  await Promise.all(
    Object.values(env.rmq.queues).map(async (qName) => {
      await channel.assertQueue(qName, {
        durable: true,
      });
    })
  );

  if (settings) {
    settings.onShutdown(() => RMQ.closeService());
  }
};
