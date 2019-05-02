import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DatabaseService } from '../_shared/services/database.service';
import { DocType, Quest, Referable } from '../_shared/services/models.all';
import { StateService } from '../_shared/services/state.service';
import { QuestModalComponent } from './quest-modal/quest-modal.component';

@Component({
  selector: 'app-quests',
  templateUrl: './quests.component.html',
})
export class QuestsComponent implements OnInit {
  quests$: Observable<(Quest & Referable)[]>;
  campaign$: any;

  constructor(
    private state: StateService,
    private modalCtrl: ModalController,
    private db: DatabaseService,
  ) { }

  async ngOnInit() {
    this.campaign$ = this.state.campaign$;
    this.quests$ = this.db
      .get<Quest>(DocType.quest)
      .pipe(
        tap(quests => quests.sort((a, b) => {
          return b.visible - a.visible;
        }))
      );
  }

  getRef(i, q: Referable) {
    return q.ref;
  }

  async create() {
    const modal = await this.modalCtrl.create({
      component: QuestModalComponent,
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
      const newq: Quest & Referable = res.data;
      await this.db.add<Quest>(DocType.quest, newq);
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
