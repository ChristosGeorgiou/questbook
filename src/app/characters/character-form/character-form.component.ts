import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Character } from '../../_shared/services/models.all';

@Component({
  selector: 'app-character-form',
  templateUrl: './character-form.component.html',
})
export class CharacterFormComponent {

  @Input() character: Character;

  constructor(
    private modalCtrl: ModalController,
    ) { }

  addItem() {
    this.character.items.push({
      visible: null
    });
  }

  removeItem(index) {
    this.character.items.splice(index, 1);
  }

  async save() {
    this.character.items = this.character.items.filter(i => i.content);
    this.modalCtrl.dismiss(this.character);
  }
}
