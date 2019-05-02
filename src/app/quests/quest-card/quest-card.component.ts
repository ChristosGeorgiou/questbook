import { Component, Input } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { DatabaseService } from '../../_shared/services/database.service';
import { Quest, Referable } from '../../_shared/services/models.all';
import { StateService } from '../../_shared/services/state.service';
import { QuestModalComponent } from '../quest-modal/quest-modal.component';

@Component({
  selector: 'app-quest-card',
  templateUrl: './quest-card.component.html',
})
export class QuestCardComponent {

  @Input() quest: Quest & Referable;

  constructor(
    private state: StateService,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private db: DatabaseService,
    private alertCtrl: AlertController,
  ) { }

  get isMaster() {
    return this.state.campaign$.value.isMaster;
  }

  get hasItems() {
    return this.quest.items.findIndex(i => i.visible !== null || this.isMaster) !== -1;
  }

  async showItem(item) {
    if (!this.quest.visible) {
      this.quest.visible = Date.now();
    }
    item.visible = Date.now();
  }

  async hideItem(item) {
    item.visible = null;
  }

  async showMenu() {
    if (!this.state.campaign$.value.isMaster) { return; }
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        { text: 'Show', icon: 'eye', handler: () => { this.show(); } },
        { text: 'Hide', icon: 'eye-off', handler: () => { this.hide(); } },
        { text: 'Remove', icon: 'trash', handler: () => { this.remove(); } },
        { text: 'Edit', icon: 'share', handler: () => { this.edit(); } },
        { text: 'Cancel', icon: 'close', role: 'cancel' }
      ]
    });
    await actionSheet.present();
  }

  async show() {
    this.quest.visible = Date.now();
    await this.db.update(this.quest.ref, this.quest);
  }

  async hide() {
    this.quest.visible = null;
    await this.db.update(this.quest.ref, this.quest);
  }

  async edit() {
    const modal = await this.modalCtrl.create({
      component: QuestModalComponent,
      componentProps: {
        quest: { ...this.quest }
      }
    });

    modal.onDidDismiss().then(async (res) => {
      const newq: Quest & Referable = res.data;
      await this.db.update(this.quest.ref, newq);
    });

    await modal.present();
  }

  async remove() {
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
            await this.db.remove(this.quest.ref);
          }
        }
      ]
    });
    await alert.present();
  }
}
