import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Quest } from '../../_shared/services/models.all';

@Component({
  selector: 'app-quest-modal',
  templateUrl: './quest-modal.component.html',
})
export class QuestModalComponent {

  @Input() quest: Quest;

  constructor(
    private modalCtrl: ModalController,
    ) { }

  addItem() {
    this.quest.items.push({
      visible: null
    });
  }

  removeItem(index) {
    this.quest.items.splice(index, 1);
  }

  async save() {
    this.modalCtrl.dismiss(this.quest);
  }
}
