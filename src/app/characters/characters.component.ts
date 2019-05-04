import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DatabaseService } from '../_shared/services/database.service';
import { Character, DocType, Referable } from '../_shared/services/models.all';
import { StateService } from '../_shared/services/state.service';
import { CharacterFormComponent } from './character-form/character-form.component';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
})
export class CharactersComponent implements OnInit {
  characters$: Observable<(Character & Referable)[]>;
  campaign$: any;

  constructor(
    private state: StateService,
    private modalCtrl: ModalController,
    private db: DatabaseService,
  ) { }

  async ngOnInit() {
    this.campaign$ = this.state.campaign$;
    this.characters$ = this.db
      .get<Character>(DocType.character)
      .pipe(
        tap(characters => characters.sort((a, b) => {
          return b.visible - a.visible;
        })),
        // tap(async characters => {
        //   const modal = await this.modalCtrl.create({
        //     component: CharacterFormComponent,
        //     componentProps: {
        //       character: characters[0]
        //     }
        //   });

        //   await modal.present();
        //   return characters;
        // })
      );
  }

  getRef(i, q: Referable) {
    return q.ref;
  }

  async create() {
    const modal = await this.modalCtrl.create({
      component: CharacterFormComponent,
      componentProps: {
        character: {
          visible: null,
          items: [{
            visible: null
          }]
        }
      }
    });

    modal.onDidDismiss().then(async (res) => {
      const newq: Character & Referable = res.data;
      await this.db.add<Character>(DocType.character, newq);
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
