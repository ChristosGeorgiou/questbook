import { Component, Input, OnInit } from '@angular/core';
import { Quest } from '../models/quest';

@Component({
  selector: 'app-quest-modal',
  templateUrl: './quest-modal.component.html',
})
export class QuestModalComponent implements OnInit {

  @Input() quests: Quest[];

  constructor() { }

  ngOnInit() { }

  addItem(quest) {
    quest.items.push({
      visible: null
    });
  }

  save(quest) {

  }
}
