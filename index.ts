import { MessageProducer } from './producer/MessageProducer';
import { MessageProducerManager } from './producer/MessageProducerManager';
import {loadConfig} from './config';
import { createExpressApp } from './server';
import { createServer } from 'http';
import { Server as WSServer } from 'ws';
import { MessageConsumer } from './consumer/MessageConsumer';

const config = loadConfig();

const producerFactory = topic => new MessageProducer(config.kafkaDefaults.globalConfig, config.kafkaDefaults.producer.topicConfig, topic);
const producers = new MessageProducerManager(producerFactory);

const express = createExpressApp(producers);
const server = createServer(express);
const wss = new WSServer({ server });


const data = {};


const consumerConfig = config.kafkaDefaults.consumer;
function urlToTopic(url) {
  return url.replace(/\W/g, '')
}
wss.on('connection', (ws, req) => {

  const consumer = new MessageConsumer(consumerConfig.baseConfig, consumerConfig.topicConfig);
  consumer.connect().then(() => {
    const topic = urlToTopic(req.url);
    console.log('subscribing to topic', topic);
    consumer.start([topic], (message) => {
      ws.send(message.value.toString());
    });
  });

});

server.listen(config.port, () => {
  console.log('listening on', server.address());
});