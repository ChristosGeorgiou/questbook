import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Character, Referable } from '../../_shared/services/models.all';

@Component({
  selector: 'app-character-form',
  templateUrl: './character-form.component.html',
})
export class CharacterFormComponent implements OnInit {
  @Input() character: Character & Referable;

  preview: string;

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit(): void {
    this.preview = this.character.portrait || '/assets/character.png';
  }

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

  loadFile($event): void {
    const file = $event.target.files[0];
    const reader: FileReader = new FileReader();
    reader.onloadend = (e) => {
      const img = new Image();
      const src = reader.result as string;
      img.src = src;
      this.preview = this.character.portrait = src;
    };
    reader.readAsDataURL(file);
  }
}
