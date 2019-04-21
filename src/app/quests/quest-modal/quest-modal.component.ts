import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { Quest } from 'src/app/services/models.all';
import { StateService } from 'src/app/services/state.service';

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
