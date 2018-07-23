import { MessageProducer } from './MessageProducer';
import { isPromise } from '../util/index';

type MessageProducerGetter = Promise<MessageProducer>;

export class MessageProducerManager {
  private producers: { [topic: string]: MessageProducerGetter };

  constructor(
    private producerFactory: (topic: string) => MessageProducer,
  ) {
    this.producers = {};
  }

  public get(topic: string): Promise<MessageProducer> {
    if (isPromise(this.producers[topic])) {
      return this.producers[topic];
    }
    const producer = this.producerFactory(topic);
    this.producers[topic] = producer.connect().then(() => producer);
    return this.producers[topic];
  }

}

