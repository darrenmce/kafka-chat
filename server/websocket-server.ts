import { MessageConsumer } from '../lib/MessageConsumer';
import { urlToTopic } from '../util';
import { Server } from 'ws';

export function initWSS(wss: Server, consumerConfig) {
  wss.on('connection', (ws, req) => {

    const consumer = new MessageConsumer(consumerConfig.baseConfig, consumerConfig.topicConfig);
    consumer.connect().then(() => {
      const topic = urlToTopic(req.url);
      console.log('subscribing to topic', topic);
      consumer.start([topic], (message) => {
        const data = { data: JSON.parse(message.value.toString()), offset: message.offset };
        ws.send(JSON.stringify(data));
      });
    });

  })
}