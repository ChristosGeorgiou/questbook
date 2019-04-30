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
import { Doc, DocType, Quest } from './models.all';
import { Referable } from './Referable';
import { StateService } from './state.service';

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
      await this._loadCampaign(campaign);
    });
  }

  add<T>(type: DocType, item: T) {
    const doc = {
      ts: Date.now(),
      type: type,
      data: item
    };
    console.log('doc', doc);
    const campaign = this.collections[this.state.campaign];
    campaign.insert(doc);
  }

  get<T>(quest: DocType) {// }: Subject<(T & Referable)[]> {
    console.log(this.sets$);
    return this.sets$[DocType[quest]].pipe(
      map(i => {
        return i as (T & Referable)[];
      })
    );
  }

  private async _loadCampaign(campaign: string) {

    console.log('load campaign', campaign);

    if (!this.collections[campaign]) {
      this.collections[campaign] = await this._createDb(campaign);
    }

    this.collections[campaign].$.subscribe(async () => {
      await this._loadSets(campaign);
    });

    await this._loadSets(campaign);
  }

  private async _createDb(campaign: string) {
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

  private async _loadSets(campaign: string) {
    Object.keys(DocType).forEach(async (t) => {
      const items: Doc[] = await this.collections[campaign].find().where('type').eq(DocType[t]).exec();
      const mappedItems = items.map(i => {
        const q = i.data as Quest & Referable;
        q.ref = i._id;
        return q;
      });
      this.sets$[t].next(mappedItems);
    });
  }
}
