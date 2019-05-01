import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DatabaseService } from '../_shared/services/database.service';
import { DocType, Quest, Referable } from '../_shared/services/models.all';
import { StateService } from '../_shared/services/state.service';
import { QuestModalComponent } from './quest-modal/quest-modal.component';

@Component({
  selector: 'app-quests',
  templateUrl: './quests.component.html',
})
export class QuestsComponent implements OnInit {
  quests$: Observable<(Quest & Referable)[]>;
  campaign$: any;

  constructor(
    private state: StateService,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private db: DatabaseService,
    private alertCtrl: AlertController,
  ) { }

  async ngOnInit() {
    this.campaign$ = this.state.campaign$;
    this.quests$ = this.db
      .get<Quest>(DocType.quest)
      .pipe(
        tap(quests => quests.sort((a, b) => {
          return b.visible - a.visible;
        }))
      );
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

    modal.onDidDismiss().then(async (res) => {
      const newq: Quest & Referable = res.data;
      if (newq.ref) {
        this.updateQuest(newq);
      } else {
        await this.db.add<Quest>(DocType.quest, newq);
      }
    });

    await modal.present();
  }

  async presentActionSheet(quest: Quest) {
    if (!this.state.campaign$.value.isMaster) { return }
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
    await this.updateQuest(quest);
  }

  async hideQuest(quest) {
    quest.visible = null;
    await this.updateQuest(quest);
  }

  async updateQuest(quest: Quest & Referable) {
    await this.db.update(quest.ref, quest);
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
            await this.db.remove(quest.ref);
          }
        }
      ]
    });
    await alert.present();
  }

  getRef(i, q: Referable) {
    return q.ref;
  }
}

@Pipe({
  name: 'visible',
  pure: false
})
export class VisiblePipe implements PipeTransform {
  constructor(private state: StateService) { }

  transform(items: any[]): any {
    if (!items) {
      return items;
    }

    return items.filter(item => item.visible || this.state.campaign$.value.isMaster);
  }
}
