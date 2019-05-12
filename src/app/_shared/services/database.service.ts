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
import { environment } from '../../../environments/environment';
import schema from '../schemas/item.schema.json';
import { CampaignDoc, CampaignDocData, CampaignDocType } from './models.all';
import { StateService } from './state.service';

RxDB.plugin(AttachmentsPlugin);
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
  sets$: { [key: string]: BehaviorSubject<CampaignDoc[]> } = {};

  constructor(
    private state: StateService,
    private zone: NgZone
  ) {

    Object.keys(CampaignDocType).forEach((t) => {
      this.sets$[t] = new BehaviorSubject<CampaignDoc[]>([]);
    });

    this.state.active$.subscribe(async (campaign) => {
      await this._loadCampaign(campaign);
    });
  }

  getCollection(docType: CampaignDocType) {
    return this.sets$[docType];
  }

  getOne(id: string): Promise<RxDocument<CampaignDoc>> {
    return this.collections[this.state.last].findOne(id).exec();
  }

  async add(type: CampaignDocType, data: CampaignDocData): Promise<string> {
    const doc = await this.collections[this.state.last].insert({
      type,
      data,
      created: Date.now(),
    });
    return doc._id;
  }

  async update(id: string, data: CampaignDocData) {
    const q: RxDocument<CampaignDoc> = await this.collections[this.state.last].findOne(id).exec();
    await q.update({ $set: { data } });
  }

  async upsertFile(id: string, name: string, data: any, type: string) {
    const q: RxDocument<CampaignDoc> = await this.collections[this.state.last].findOne(id).exec();
    await q.putAttachment({
      id: name,
      data: data,
      type: type
    });
  }

  async remove(id: any) {
    const q: RxDocument<CampaignDoc> = await this.collections[this.state.last].findOne(id).exec();
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
      migrationStrategies: {}
    });

    // sync
    console.log('DatabaseService: sync');
    db[campaign].sync({ remote: environment.database + campaign + '/' });

    return db[campaign];
  }

  private async _loadSets(campaign: string) {
    const items: RxDocument<CampaignDoc>[] = await this.collections[campaign].find().exec();

    for (let i = 0; i < items.length; i++) {
      await this.loadFiles(items[i]);
    }

    const grouped = items.reduce((r, a) => {
      r[a.type] = r[a.type] || [];
      r[a.type].push(a);
      return r;
    }, {});

    Object.keys(grouped).forEach((key) => {
      const is = grouped[key].sort((a, b) => {
        return (b.data.visible || 0) - (a.data.visible || 0);
      });
      this.zone.run(() => {
        this.sets$[key].next(is);
      });
    });
  }

  async loadFiles(doc: RxDocument<CampaignDoc>) {
    const attachments = await doc.allAttachments();
    doc.files = {};
    for (let i = 0; i < attachments.length; i++) {
      const blobBuffer = await attachments[i].getData();
      doc.files[attachments[i].id] = await this.getImageAttachment(blobBuffer);
    }
  }

  getImageAttachment(blobBuffer: Blob) {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result);
        };
        reader.readAsDataURL(blobBuffer);
      } catch (err) {
        reject('error');
      }
    });
  }
}
