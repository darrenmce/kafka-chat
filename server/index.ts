import * as express from 'express';
import * as bodyParser from 'body-parser';
import { MessageProducerManager } from '../producer/MessageProducerManager';
import { jsonToBuffer } from '../util';
import { MessageConsumer } from '../consumer/MessageConsumer';

type UserId = string;

type MessageInput = {
  message: string
};

type MessageMeta = {
  channel: string,
  user: UserId
}

type Message = MessageInput & MessageMeta;

function createMessage(message: MessageInput, meta: MessageMeta): Message {
  return {
    ...message,
    ...meta
  };
}

export function createExpressApp(producers: MessageProducerManager) {
  const app = express();

  app.use(bodyParser.json({ type: '*/*' }));

  app.set('view engine', 'pug');
  app.use(express.static('public'));

  app.get('/health', (req, res) => {
    res.sendStatus(200);
  });

  app.post('/user/:user/message/:channel', async (req, res) => {
    const message = createMessage(req.body, req.params as MessageMeta);
    const topic = req.params.channel;
    const key = `${req.params.user}:${topic}`;
    const producer = await producers.get(topic);

    const keys = producer.produce([{ key, message: jsonToBuffer(message) }]);

    res.send(keys);
  });


  app.get('/', (req, res) => {
    res.render('index');
  });

  return app;
}