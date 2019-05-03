import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Quest } from '../../_shared/services/models.all';

@Component({
  selector: 'app-quest-form',
  templateUrl: './quest-form.component.html',
})
export class QuestFormComponent {

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
    this.quest.items = this.quest.items.filter(i => i.content);
    this.modalCtrl.dismiss(this.quest);
  }
}
