import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Quest } from 'src/app/services/models.all';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-quest-card',
  templateUrl: './quest-card.component.html',
})
export class QuestCardComponent implements OnInit {

  @Input() quest: Quest;
  @Output() update = new EventEmitter<Quest>();

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

  async showItem(item) {
    if (!this.quest.visible) {
      this.quest.visible = Date.now();
    }

    item.visible = Date.now();
    this.quest.items.sort((a, b) => {
      return b.visible - a.visible;
    });

    this.update.emit(this.quest);
  }

  async hideItem(item) {
    item.visible = null;
    this.update.emit(this.quest);
  }
}
