import { Component, NgZone, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { RxCollection, RxDocument } from 'rxdb';
import { DatabaseService } from '../services/database.service';
import { Doc, DocType, Quest } from '../services/models.all';
import { StateService } from '../services/state.service';
import { QuestModalComponent } from './quest-modal/quest-modal.component';

interface Referable {
  ref?: string;
}

@Component({
  selector: 'app-quests',
  templateUrl: './quests.component.html',
})
export class QuestsComponent implements OnInit {

  questsCollection: RxCollection<Doc>;
  quests: (Quest & Referable)[];

  constructor(
    private state: StateService,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private db: DatabaseService,
    private zone: NgZone,
    private alertCtrl: AlertController,
  ) { }

  get isMaster() {
    return this.state.isMaster;
  }

  async ngOnInit() {
    this.questsCollection = await this.db.get(this.state.campaign);
    this.questsCollection.$.subscribe((ev) => {
      this.getData();
    });
    this.getData();
  }

  async getData() {
    console.log('load data');
    const items: Doc[] = await this.questsCollection.find()
      .where('type').eq(DocType.quest).exec();
    this.zone.run(() => {
      this.quests = items.map(i => {
        const q = i.data as Quest & Referable;
        q.ref = i._id;
        return q;
      });
    });
  }

  async questForm(quest: Quest) {

    const q = quest || {
      visible: null,
      items: [{
        visible: null
      }]
    };

    const modal = await this.modalCtrl.create({
      component: QuestModalComponent,
      componentProps: {
        quest: { ...q }
      }
    });

    modal.onDidDismiss().then((res) => {
      const newq: Quest & Referable = res.data;
      if (newq.ref) {
        this.updateQuest(newq);
      } else {
        this.questsCollection.insert({
          ts: Date.now(),
          type: DocType.quest,
          data: newq
        });
      }
    });

    await modal.present();
  }

  async presentActionSheet(quest: Quest) {
    if (!this.isMaster) { return; }
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [{
        text: 'Show', icon: 'eye', handler: () => { this.showQuest(quest); }
      }, {
        text: 'Hide', icon: 'eye-off', handler: () => { this.hideQuest(quest); }
      }, {
        text: 'Remove', icon: 'trash', handler: () => { this.removeQuest(quest); }
      }, {
        text: 'Edit', icon: 'share', handler: () => { this.questForm(quest); }
      }, {
        text: 'Cancel', icon: 'close', role: 'cancel', handler: () => { }
      }]
    });
    await actionSheet.present();
  }

  async showQuest(quest) {
    quest.visible = Date.now();
    this.quests.sort((a, b) => {
      return b.visible - a.visible;
    });
    await this.updateQuest(quest);
  }

  async hideQuest(quest) {
    quest.visible = null;
    await this.updateQuest(quest);
  }

  async updateQuest(quest: Quest & Referable) {
    const q: RxDocument<Doc> = await this.questsCollection.findOne(quest.ref).exec();
    await q.update({
      $set: {
        data: quest
      }
    });
  }

  async removeQuest(quest) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Remove',
      subHeader: 'This quest will be removed from all players. This action is not reversible.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Remove',
          handler: async () => {
            const q: RxDocument<Doc> = await this.questsCollection.findOne(quest.ref).exec();
            await q.remove();
          }
        }
      ]
    });
    await alert.present();
  }
}
