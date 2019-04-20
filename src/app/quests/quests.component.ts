import { Component, NgZone, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
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

  quests$: RxCollection<Doc>;

  quests: (Quest & Referable)[] = [{
    subject: 'Find the secret city',
    description: 'Where is the secret sity',
    visible: 1555753513000,
    items: [{
      content: 'The city is under the sun',
      visible: 1555753513000,
    }, {
      content: 'The one that has no name knows how to find it',
      visible: null,
    }, {
      content: 'The blue dragon has destroy the city before',
      visible: 1555753513000,
    }]
  }, {
    subject: 'Find who stole the amber staff',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse hendrerit purus id nulla dignissim vulputate. Cras mattis et justo quis placerat. Fusce ut elementum augue. Donec convallis nisl non efficitur consequat. Morbi pulvinar mi vel orci maximus rutrum. Cras dapibus augue eu tellus pulvinar, dapibus fringilla metus eleifend. In in laoreet est. Mauris vel sodales nunc.',
    visible: 1555749333000,
    items: [{
      content: 'Lorem is the brother of ipsum',
      visible: 1555749373000,
    }, {
      content: 'Ispum is missing',
      visible: 1555749552000,
    }]
  }];

  constructor(
    private state: StateService,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private db: DatabaseService,
    private zone: NgZone
  ) { }

  get isMaster() {
    return this.state.isMaster;
  }

  async ngOnInit() {
    this.quests$ = await this.db.get(this.state.campaign);
    this.quests$.$.subscribe((ev) => {
      this.getData();
    });
    this.getData();
  }

  async getData() {
    console.log('load data');
    const items: Doc[] = await this.quests$.find()
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
        this.quests$.insert({
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
        text: 'Delete', icon: 'trash', handler: () => { console.log('Delete clicked'); }
      }, {
        text: 'Edit', icon: 'share', handler: () => { this.questForm(quest); }
      }, {
        text: 'Cancel', icon: 'close', role: 'cancel', handler: () => { console.log('Cancel clicked'); }
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
    const q: RxDocument<Doc> = await this.quests$.findOne(quest.ref).exec();
    await q.update({
      $set: {
        data: quest
      }
    });
  }
}
