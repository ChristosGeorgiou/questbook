import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatabaseService } from '../_shared/services/database.service';
import { CampaignDocType, Character } from '../_shared/services/models.all';
import { StateService } from '../_shared/services/state.service';
import { CharacterFormComponent } from './character-form/character-form.component';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
})
export class CharactersComponent implements OnInit {
  characters$: Observable<Character[]>;
  campaign$: any;

  constructor(
    private state: StateService,
    private modalCtrl: ModalController,
    private db: DatabaseService,
  ) { }

  async ngOnInit() {
    this.campaign$ = this.state.campaign$;
    this.characters$ = this.db.getCollection(CampaignDocType.character)
      .pipe(
        map((docs) => {
          return docs.map(doc => {
            const character = Object.assign(doc.data, {
              _id: doc._id,
              portrait: doc.files.portrait
            }) as Character;
            return character;
          });
        })
      );

    this.create();
  }

  async create() {
    const modal = await this.modalCtrl.create({
      component: CharacterFormComponent
    });
    await modal.present();
  }
}
