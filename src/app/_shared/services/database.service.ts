import { Injectable } from '@angular/core';
import * as AdapterHttp from 'pouchdb-adapter-http';
import * as AdapterIDB from 'pouchdb-adapter-idb';
import { RxCollection } from 'rxdb';
import RxDB from 'rxdb/plugins/core';
import EncryptionPlugin from 'rxdb/plugins/encryption';
import LeaderelectionPlugin from 'rxdb/plugins/leader-election';
import ReplicationPlugin from 'rxdb/plugins/replication';
import UpdatePlugin from 'rxdb/plugins/update';
import ValidatePlugin from 'rxdb/plugins/validate';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.js';
import schema from '../schemas/item.schema.json';
import { Doc, DocType, Quest } from './models.all.js';
import { Referable } from './Referable';
import { StateService } from './state.service.js';

RxDB.plugin(ValidatePlugin);
RxDB.plugin(UpdatePlugin);
RxDB.plugin(ReplicationPlugin);
RxDB.plugin(LeaderelectionPlugin);
RxDB.plugin(EncryptionPlugin);
RxDB.plugin(AdapterIDB);
RxDB.plugin(AdapterHttp);

@Injectable()
export class DatabaseService {
  collections: { [key: string]: RxCollection } = {};
  sets$: { [key: string]: Subject<Referable[]> } = {};

  constructor(
    private state: StateService,
  ) {

    Object.keys(DocType).forEach(async t => {
      this.sets$[t] = new Subject<Referable[]>();
    });

    this.state.activeCampaign.subscribe(async (campaign) => {
      await this._load(campaign);
    });
  }

  get<T>(quest: DocType) {// }: Subject<(T & Referable)[]> {
    return this.sets$[DocType[quest]].pipe(
      map(i => {
        return i as (T & Referable)[];
      })
    );
  }

  private async _load(campaign: string) {

    if (!this.collections[campaign]) {
      this.collections[campaign] = await this._create(campaign);
    }

    this.collections[campaign].$.subscribe(() => {
      Object.keys(DocType).forEach(async t => {
        const items: Doc[] = await this.collections[campaign].find().where('type').eq(t).exec();
        const mappedItems = items.map(i => {
          const q = i.data as Quest & Referable;
          q.ref = i._id;
          return q;
        });
        this.sets$[t].next(mappedItems);
      });
    });

  }

  private async _create(campaign: string) {
    console.log('DatabaseService: creating database..');
    const db = await RxDB.create({ name: campaign, adapter: 'idb' });

    console.log('DatabaseService: create collections');
    await db.collection({
      name: campaign,
      schema: schema
    });

    // sync
    console.log('DatabaseService: sync');
    db[campaign].sync({ remote: environment.database + campaign + '/' });

    return db[campaign];
  }
}
