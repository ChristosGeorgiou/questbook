import { Component, Input, OnInit } from '@angular/core';
import { StateService } from 'src/app/services/state.service';
import { Quest } from '../models/quest';

@Component({
  selector: 'app-quest-card',
  templateUrl: './quest-card.component.html',
})
export class QuestCardComponent implements OnInit {

  @Input() quest: Quest;

  constructor(
    private state: StateService
  ) { }

  get isMaster() {
    return this.state.isMaster;
  }

  ngOnInit() {
  }

  hasItems() {
    return this.quest.items.find(i => i.visible !== null) !== null;
  }

  showItem(item) {
    if (!this.quest.visible) {
      this.quest.visible = Date.now();
    }

    item.visible = Date.now();
    this.quest.items.sort((a, b) => {
      return b.visible - a.visible;
    });
  }

  hideItem(item) {
    item.visible = null;
  }
}
