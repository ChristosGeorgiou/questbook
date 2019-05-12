import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DatabaseService } from 'src/app/_shared/services/database.service';
import { CampaignDocType, CharacterData } from '../../_shared/services/models.all';

@Component({
  selector: 'app-character-form',
  templateUrl: './character-form.component.html',
})
export class CharacterFormComponent implements OnInit {
  @Input() characterId: string;

  portrait = '/assets/character.png';
  newPortrait = false;

  data: CharacterData = {
    items: [{}]
  };
  file: Blob;

  constructor(
    private db: DatabaseService,
    private modalCtrl: ModalController,
  ) { }

  async ngOnInit() {
    if (this.characterId) {
      const doc = await this.db.getOne(this.characterId);
      await this.db.loadFiles(doc);
      this.data = doc.data;
      this.portrait = doc.files.portrait;
    }
  }

  addItem() {
    this.data.items.push({});
  }

  removeItem(index) {
    this.data.items.splice(index, 1);
  }

  async save() {
    const items = this.data.items || [];
    this.data.items = items.filter(i => i.content);

    if (this.characterId) {
      await this.db.update(this.characterId, this.data);
    } else {
      this.characterId = await this.db.add(CampaignDocType.character, this.data);
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
