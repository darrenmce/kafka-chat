import { MessageProducer } from './lib/MessageProducer';
import { MessageProducerManager } from './lib/MessageProducerManager';
import {loadConfig} from './config';
import { createExpressApp } from './server';
import { createServer } from 'http';
import { Server as WSServer } from 'ws';
import { initWSS } from './server/websocket-server';

const config = loadConfig();
const consumerConfig = config.kafkaDefaults.consumer;
const producerFactory = topic => new MessageProducer(config.kafkaDefaults.globalConfig, config.kafkaDefaults.producer.topicConfig, topic);

const producers = new MessageProducerManager(producerFactory);
const express = createExpressApp(producers);
const server = createServer(express);
const wss = new WSServer({ server });
initWSS(wss, consumerConfig);

server.listen(config.port, () => {
  console.log('listening on', server.address());
});