import { KafkaConsumer } from 'node-rdkafka';
import Timer = NodeJS.Timer;

export class MessageConsumer {

  private consumer: KafkaConsumer;
  private interval: Timer;
  constructor(baseConfig: any, topicConfig: any) {
    this.consumer = new KafkaConsumer(baseConfig, topicConfig);
  }

  public connect(): Promise<MessageConsumer> {
    return new Promise((resolve, reject) => {
      this.consumer.connect({}, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(this);
      })
    });
  }

  public start(topics: string[], handler) {
    this.consumer.subscribe(topics);
    this.consumer.consume();
    this.consumer.on('data', handler)
  }

  public stop() {
    this.consumer.unsubscribe();
  }

  public close(): Promise<void>{
    clearInterval(this.interval);
    return new Promise((resolve, reject) => {
      this.consumer.disconnect((err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }
}

