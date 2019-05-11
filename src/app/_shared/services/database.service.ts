import { Injectable, NgZone } from '@angular/core';
import * as AdapterHttp from 'pouchdb-adapter-http';
import * as AdapterIDB from 'pouchdb-adapter-idb';
import { RxCollection, RxDocument } from 'rxdb';
import AttachmentsPlugin from 'rxdb/plugins/attachments';
import RxDB from 'rxdb/plugins/core';
import EncryptionPlugin from 'rxdb/plugins/encryption';
import LeaderelectionPlugin from 'rxdb/plugins/leader-election';
import ReplicationPlugin from 'rxdb/plugins/replication';
import UpdatePlugin from 'rxdb/plugins/update';
import ValidatePlugin from 'rxdb/plugins/validate';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import schema from '../schemas/item.schema.json';
import { BaseModel, Doc, DocType } from './models.all';
import { StateService } from './state.service';


RxDB.plugin(AttachmentsPlugin);
RxDB.plugin(ValidatePlugin);
RxDB.plugin(UpdatePlugin);
RxDB.plugin(ReplicationPlugin);
RxDB.plugin(LeaderelectionPlugin);
RxDB.plugin(EncryptionPlugin);
RxDB.plugin(AdapterIDB);
RxDB.plugin(AdapterHttp);

// PouchDB.debug.enable('*');

@Injectable()
export class DatabaseService {

  collections: { [key: string]: RxCollection } = {};
  sets$: { [key: string]: BehaviorSubject<BaseModel[]> } = {};

  constructor(
    private state: StateService,
    private zone: NgZone
  ) {

    Object.keys(DocType).forEach(async t => {
      this.sets$[t] = new BehaviorSubject<BaseModel[]>([]);
    });

    this.state.active$.subscribe(async (campaign) => {
      await this._loadCampaign(campaign);
    });
  }

  getCollection<T>(docType: DocType) {
    const source = this.sets$[DocType[docType]];
    return source.pipe(
      map(i => {
        return i as T[];
      })
    );
  }

  getOne(id: string): Promise<Doc> {
    return this.collections[this.state.last].findOne(id).exec();
  }

  async add<T>(type: DocType, item: T) {
    const doc = {
      ts: Date.now(),
      type: type,
      data: item
    };
    return this.collections[this.state.last].insert(doc);
  }

  async update(ref: string, data: any) {
    const q: RxDocument<Doc> = await this.collections[this.state.last].findOne(ref).exec();
    await q.update({
      $set: {
        data
      }
    });
  }

  async upsertFile(ref: string, id: string, data: any, type: string) {
    const q: RxDocument<Doc> = await this.collections[this.state.last].findOne(ref).exec();
    await q.putAttachment({
      id: id,
      data: data,
      type: type
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
      schema: schema,
      migrationStrategies: {
        1: (oldDoc) => oldDoc,
        2: (oldDoc) => oldDoc,
      }
    });

    // sync
    console.log('DatabaseService: sync');
    db[campaign].sync({ remote: environment.database + campaign + '/' });

    return db[campaign];
  }

  private async _loadSets(campaign: string) {
    Object.keys(DocType).forEach(async (t) => {
      const items: RxDocument<Doc>[] = await this.collections[campaign].find().where('type').eq(DocType[t]).exec();

      const mappedItems = items
        .filter(i => i.data)
        .map((i) => {
          const q = i.data as BaseModel;
          q.ref = i._id;
          this.loadFiles(q, i);
          return q;
        });

      this.zone.run(() => {
        this.sets$[t].next(mappedItems);
      });
    });
  }

  async loadFiles(data: any, doc: RxDocument<any>) {
    const files = {};
    if (!doc['_attachments']) { return files; }
    const attachments = await doc.allAttachments();
    for (let i = 0; i < attachments.length; i++) {
      data[attachments[i].id] = await this.getImageAttachment(attachments[i]);
    }
  }

  async getImageAttachment(attachment): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const blobBuffer = await attachment.getData();
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          const src = 'data:' + attachment.type + ';base64,' + base64;
          resolve(src);
        };
        reader.readAsDataURL(blobBuffer);
      } catch (err) {
        reject();
      }
    });
  }
}
