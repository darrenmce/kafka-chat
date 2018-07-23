import { Producer } from 'node-rdkafka';
import * as R from 'ramda';
import { EventEmitter } from 'events';

type MessageKey = string;

type ProduceParams = {
  key: MessageKey,
  message: object
};

const POLL_INTERVAL = 100;

export class MessageProducer {

  static defaultBaseConfig: any = {
    'group.id': 'kafka',
    'dr_cb': true
  };

  private producer: Producer;
  public events: EventEmitter;

  constructor(
    baseConfig: any,
    topicConfig: any,
    private topic: string,
    private partition: number = 0
  ) {
    const mergedBaseConfig = R.merge(MessageProducer.defaultBaseConfig, baseConfig);
    this.producer = new Producer(mergedBaseConfig, topicConfig);
    this.events = new EventEmitter();
    this.configureProducer();
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.producer.connect({}, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      })
    });
  }

  public produce(msgs: Array<ProduceParams>): Array<MessageKey> {
    return msgs.map(this.produceOne.bind(this));
  }

  protected configureProducer() {
    this.producer.on('delivery-report', (err, report) => {
      this.events.emit('delivered', report);
    });

    this.producer.on('event.error', (err) => {
      this.events.emit('error', err);
    });

    this.producer.on('ready', () => {
      this.events.emit('ready');
    });

    this.producer.setPollInterval(POLL_INTERVAL);
  }

  protected produceOne({key, message}: ProduceParams): MessageKey {
    this.producer.produce(this.topic, this.partition, message, key, Date.now());
    return key;
  }
}