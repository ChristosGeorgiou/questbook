import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DatabaseService } from 'src/app/_shared/services/database.service';
import { CampaignDocType, QuestData } from 'src/app/_shared/services/models.all';

@Component({
  selector: 'app-quest-form',
  templateUrl: './quest-form.component.html',
})
export class QuestFormComponent {

  @Input() questId: string;

  data: QuestData = {
    items: [{}]
  };

  constructor(
    private db: DatabaseService,
    private modalCtrl: ModalController,
  ) { }

  async ngOnInit() {
    if (this.questId) {
      const doc = await this.db.getOne(this.questId);
      this.data = doc.data;
    }
  }

  addItem() {
    this.data.items.push({
      visible: null
    });
  }

  removeItem(index) {
    this.data.items.splice(index, 1);
  }

  async save() {
    const items = this.data.items || [];
    this.data.items = items.filter(i => i.content);
    if (this.questId) {
      await this.db.update(this.questId, this.data);
    } else {
      this.questId = await this.db.add(CampaignDocType.quest, this.data);
    }
    await this.modalCtrl.dismiss();
  }

  async close() {
    await this.modalCtrl.dismiss();
  }
}
