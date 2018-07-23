import * as rc from 'rc';
// @ts-ignore
import { name as appName } from './package.json';
let config;

export function loadConfig() {
  if (!config) {
    config = rc(appName, {
      port: 8080,
      kafkaDefaults: {
        producer: {
          baseConfig: {
            'metadata.broker.list': 'kafka:9092',
            'group.id': 'kafka',
            'dr_cb': true
          },
          topicConfig: {
            'request.required.acks': 1
          }
        },
        consumer: {
          baseConfig: {
            'metadata.broker.list': 'kafka:9092',
            'group.id': 'kafka',
            'enable.auto.commit': false
          },
          topicConfig: {
            'auto.offset.reset': 'earliest'
          }
        }
      }
    });
  }
  return config;

}