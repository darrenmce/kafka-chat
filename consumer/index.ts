import { MessageConsumer } from './MessageConsumer';


function getValueAsObject(data) {
  try {
    return { value: JSON.parse(data.value.toString()) };
  } catch (e) {
    return { value: data.value.toString() };
  }
}

type Addresses = {
  [key: string]: Address
}

type Address = any;

class AddressWorker extends MessageConsumer {
  constructor(
    baseConfig :any, topicConfig: any,
    private addresses: Addresses = {}
  ) {
    super(baseConfig, topicConfig);
  }

  protected messageHandler(err: Error | null, message: any): void {
    if (err) {
      throw err;
    }
    if (message.length) {
      const [address] = message;
      this.addresses[address.key.toString()] = getValueAsObject(address);
      console.log(this.addresses);
    }
  }
}

const baseConfig = {
  'metadata.broker.list': 'kafka:9092',
  'group.id': 'kafka',
  'enable.auto.commit': false
};

const topicConfig = { 'auto.offset.reset': 'earliest' };

const worker = new AddressWorker(baseConfig, topicConfig);
worker.connect().then(() => {
  console.log('connected');
  worker.start(['address']);
});

function gracefulShutdown() {
  console.log('gracefully shutting down, send signal again to force.');
  worker.close().then(() => {
    process.exit(0);
  });
}
process.once('SIGTERM', gracefulShutdown);
process.once('SIGINT', gracefulShutdown);
