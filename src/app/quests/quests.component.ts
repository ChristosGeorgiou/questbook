import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DatabaseService } from '../_shared/services/database.service';
import { BaseModel, DocType, Quest, QuestData } from '../_shared/services/models.all';
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
    this.quests$ = this.db
      .get<QuestData>(DocType.quest)
      .pipe(
        tap(quests => quests.sort((a, b) => {
          return b.visible - a.visible;
        }))
      );
  }

  getRef(i, q: BaseModel) {
    return q.ref;
  }

  async create() {
    const modal = await this.modalCtrl.create({
      component: QuestFormComponent,
      componentProps: {
        quest: {
          visible: null,
          items: [{
            visible: null
          }]
        }
      }
    });

    modal.onDidDismiss().then(async (res) => {
      const newq: QuestData = res.data;
      await this.db.add<QuestData>(DocType.quest, newq);
    });

    await modal.present();
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
