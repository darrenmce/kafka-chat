import * as express from 'express';
import * as bodyParser from 'body-parser';
import { MessageProducerManager } from '../lib/MessageProducerManager';
import { jsonToBuffer } from '../util';
import * as path from 'path';

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

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  
  app.use(bodyParser.json({ type: '*/*' }));

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

  app.use(express.static(path.join(__dirname, '../client/build'), {
    index: "index.html"
  }));

  return app;
}