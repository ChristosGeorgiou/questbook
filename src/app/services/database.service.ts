import { Injectable } from '@angular/core';
import * as AdapterHttp from 'pouchdb-adapter-http';
import * as AdapterIDB from 'pouchdb-adapter-idb';
import { RxDatabase } from 'rxdb';
import RxDB from 'rxdb/plugins/core';
import EncryptionPlugin from 'rxdb/plugins/encryption';
import LeaderelectionPlugin from 'rxdb/plugins/leader-election';
import ReplicationPlugin from 'rxdb/plugins/replication';
import schema from '../schemas/item.schema.json';

RxDB.plugin(ReplicationPlugin);

RxDB.plugin(LeaderelectionPlugin);
RxDB.plugin(EncryptionPlugin);
RxDB.plugin(AdapterIDB);
RxDB.plugin(AdapterHttp);

const campaign = 'campaign01';

const collections = [
  {
    name: campaign,
    schema: schema,
    sync: true
  }
];

console.log('hostname: ' + window.location.hostname);
const syncURL = 'http://127.0.0.1:5984/';

let doSync = true;
if (window.location.hash === '#nosync') { doSync = false; }

@Injectable()
export class DatabaseService {
  static dbPromise: Promise<RxDatabase> = null;

  private async _create(): Promise<RxDatabase> {
    console.log('DatabaseService: creating database..');
    const db = await RxDB.create({ name: campaign, adapter: 'idb' });
    console.log('DatabaseService: created database');
    window['db'] = db; // write to window for debugging

    console.log('DatabaseService: create collections');
    await Promise.all(collections.map(colData => db.collection(<any>colData)));

    // sync
    console.log('DatabaseService: sync');
    collections
      .filter(col => col.sync)
      .map(col => col.name)
      .forEach(colName => db[colName].sync({ remote: syncURL + colName + '/' }));

    return db;
  }

  get(): Promise<RxDatabase> {
    if (DatabaseService.dbPromise) {
      return DatabaseService.dbPromise;
    }

    // create database
    DatabaseService.dbPromise = this._create();
    return DatabaseService.dbPromise;
  }
}
