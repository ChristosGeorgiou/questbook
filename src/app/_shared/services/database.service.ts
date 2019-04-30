import { Injectable } from '@angular/core';
import * as AdapterHttp from 'pouchdb-adapter-http';
import * as AdapterIDB from 'pouchdb-adapter-idb';
import { RxCollection, RxDocument } from 'rxdb';
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
import { Doc, DocType, Quest, Referable } from './models.all';
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

  constructor(
    private state: StateService,
  ) {

    Object.keys(DocType).forEach(async t => {
      this.sets$[t] = new Subject<Referable[]>();
    });

    this.state.active$.subscribe(async (campaign) => {
      await this._loadCampaign(campaign);
    });
  }

  collections: { [key: string]: RxCollection } = {};
  sets$: { [key: string]: Subject<Referable[]> } = {};

  get<T>(quest: DocType) {
    return this.sets$[DocType[quest]].pipe(
      map(i => {
        return i as (T & Referable)[];
      })
    );
  }

  async add<T>(type: DocType, item: T) {
    const doc = {
      ts: Date.now(),
      type: type,
      data: item
    };
    await this.collections[this.state.last].insert(doc);
  }

  async update(ref: string, data: any) {
    const q: RxDocument<Doc> = await this.collections[this.state.last].findOne(ref).exec();
    await q.update({
      $set: {
        data
      }
    });
  }

  async remove(ref: any) {
    const q: RxDocument<Doc> = await this.collections[this.state.last].findOne(ref).exec();
    await q.remove();
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
