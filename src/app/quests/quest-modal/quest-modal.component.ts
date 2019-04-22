import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DatabaseService } from '../../_shared/services/database.service';
import { Quest } from '../../_shared/services/models.all';
import { StateService } from '../../_shared/services/state.service';

@Component({
  selector: 'app-quest-modal',
  templateUrl: './quest-modal.component.html',
})
export class QuestModalComponent {

  @Input() quest: Quest;

  constructor(
    private state: StateService,
    private db: DatabaseService,
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
