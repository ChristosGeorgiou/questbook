import { Component, Input } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { DatabaseService } from '../../_shared/services/database.service';
import { Character } from '../../_shared/services/models.all';
import { StateService } from '../../_shared/services/state.service';
import { CharacterFormComponent } from '../character-form/character-form.component';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
})
export class CharacterCardComponent {

  @Input() character: Character;

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
    return this.character.items.findIndex(i => i.visible !== null || this.isMaster) !== -1;
  }

  async showItem(item) {
    if (!this.character.visible) {
      this.character.visible = Date.now();
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
    this.character.visible = Date.now();
    await this.db.update(this.character.ref, this.character);
  }

  async hide() {
    this.character.visible = null;
    await this.db.update(this.character.ref, this.character);
  }

  async edit() {
    const modal = await this.modalCtrl.create({
      component: CharacterFormComponent,
      componentProps: {
        character: { ...this.character }
      }
    });

    modal.onDidDismiss().then(async (res) => {
      if (!res.data) { return; }
      const newq: CharacterData = res.data;
      await this.db.update(this.character.ref, newq);
    });

    await modal.present();
  }

  async remove() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Remove',
      subHeader: 'This character will be removed from all players. This action is not reversible.',
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
            await this.db.remove(this.character.ref);
          }
        }
      ]
    });
    await alert.present();
  }
}
