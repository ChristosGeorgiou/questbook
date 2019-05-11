import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DatabaseService } from 'src/app/_shared/services/database.service';
import { Character, CharacterData, Doc, DocType } from '../../_shared/services/models.all';

@Component({
  selector: 'app-character-form',
  templateUrl: './character-form.component.html',
})
export class CharacterFormComponent implements OnInit {
  @Input() characterId: string;

  portrait = '/assets/character.png';
  newPortrait = false;
  doc: Doc;
  character: Character = {
    items: []
  };
  file: Blob;

  constructor(
    private db: DatabaseService,
    private modalCtrl: ModalController,
  ) { }

  async ngOnInit() {
    if (this.characterId) {
      this.doc = await this.db.getOne(this.characterId);
      this.character = this.doc.data as Character;
      await this.db.loadFiles(this.character, this.doc);
      this.portrait = this.character.portrait;
    }
  }

  addItem() {
    this.character.items.push({});
  }

  removeItem(index) {
    this.character.items.splice(index, 1);
  }

  async save() {
    const items = this.character.items || [];
    this.character.items = items.filter(i => i.content);

    if (this.characterId) {
      await this.db.update(this.characterId, this.character);
    } else {
      const doc = await this.db.add<CharacterData>(DocType.character, this.character);
      this.characterId = doc.get('_id');
    }

    if (this.newPortrait) {
      await this.db.upsertFile(this.characterId, 'portrait', this.file, 'image/jpeg');
    }

    this.modalCtrl.dismiss();
  }

  loadFile($event): void {
    this.file = $event.target.files[0];
    const reader: FileReader = new FileReader();
    reader.onloadend = (e) => {
      const img = new Image();
      const src = reader.result as string;
      img.src = src;
      this.portrait = src;
      this.newPortrait = true;
    };
    reader.readAsDataURL(this.file);
  }
}
