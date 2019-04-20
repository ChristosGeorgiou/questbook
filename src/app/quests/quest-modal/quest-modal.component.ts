import { Component, Input, OnInit } from '@angular/core';
import { Quest } from '../models/quest';

@Component({
  selector: 'app-quest-modal',
  templateUrl: './quest-modal.component.html',
})
export class QuestModalComponent implements OnInit {

  @Input() quest: Quest;

  constructor() { }

  ngOnInit() {
    if (!this.quest) {
      this.quest = {
        visible: null,
        items: [{
          visible: null
        }]
      };
    }
  }

  addItem() {
    this.quest.items.push({
      visible: null
    });
  }

  removeItem(item) {
    const i = this.quest.items.findIndex(item);
    this.quest.items.splice(i, 1);
  }

  save() {

  }
}
