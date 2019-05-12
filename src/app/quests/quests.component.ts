import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatabaseService } from '../_shared/services/database.service';
import { CampaignDocType, Quest } from '../_shared/services/models.all';
import { StateService } from '../_shared/services/state.service';
import { QuestFormComponent } from './quest-form/quest-form.component';

@Component({
  selector: 'app-quests',
  templateUrl: './quests.component.html',
})
export class QuestsComponent implements OnInit {
  quests$: Observable<Quest[]>;
  campaign$: any;

  constructor(
    private state: StateService,
    private modalCtrl: ModalController,
    private db: DatabaseService,
  ) { }

  async ngOnInit() {
    this.campaign$ = this.state.campaign$;
    this.quests$ = this.db.getCollection(CampaignDocType.quest)
      .pipe(
        map((docs) => {
          return docs.map(doc => {
            const quest = Object.assign(doc.data, {
              _id: doc._id,
            }) as Quest;
            return quest;
          });
        })
      );
  }

  async create() {
    const modal = await this.modalCtrl.create({
      component: QuestFormComponent,
    });
    await modal.present();
  }
}


