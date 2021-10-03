import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

/**
 * user: user-rol-project
 * pass: E6cwNedZMndC2ynX
 */

const config = {
  name: 'mongodb',
  connector: 'mongodb',
  url: 'mongodb+srv://user-rol-project:E6cwNedZMndC2ynX@cluster0.2oncd.mongodb.net/user-rol?retryWrites=true&w=majority',
  host: 'localhost',
  port: 27017,
  user: '',
  password: '',
  database: 'user-rol',
  useNewUrlParser: true
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MongodbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'mongodb';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mongodb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
