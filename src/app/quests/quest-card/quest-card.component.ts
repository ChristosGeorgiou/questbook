import { Component, Input } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { DatabaseService } from '../../_shared/services/database.service';
import { Quest } from '../../_shared/services/models.all';
import { StateService } from '../../_shared/services/state.service';
import { QuestFormComponent } from '../quest-form/quest-form.component';

@Component({
  selector: 'app-quest-card',
  templateUrl: './quest-card.component.html',
})
export class QuestCardComponent {
  @Input() quest: Quest;

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

  async toogleItem(item) {
    if (!this.quest.visible || !item.visible) {
      this.quest.visible = Date.now();
    }
    item.visible = item.visible ? null : Date.now();
    await this.update();
  }

  async menu() {
    if (!this.state.campaign$.value.isMaster) { return; }
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        { text: 'Show', icon: 'eye', handler: () => { this.show(); } },
        { text: 'Hide', icon: 'eye-off', handler: () => { this.hide(); } },
        { text: 'Remove', icon: 'trash', handler: () => { this.remove(); } },
        { text: 'Edit', icon: 'create', handler: () => { this.edit(); } },
        { text: 'Cancel', icon: 'close', role: 'cancel' }
      ]
    });
    await actionSheet.present();
  }

  async show() {
    this.quest.visible = Date.now();
    await this.update();
  }

  async hide() {
    this.quest.visible = null;
    await this.update();
  }

  async edit() {
    const modal = await this.modalCtrl.create({
      component: QuestFormComponent,
      componentProps: {
        questId: this.quest._id
      }
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
            await this.db.remove(this.quest._id);
          }
        }
      ]
    });
    await alert.present();
  }

  private async update() {
    await this.db.update(this.quest._id, this.quest);
  }
}
