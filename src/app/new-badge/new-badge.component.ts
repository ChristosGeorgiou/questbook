import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-badge',
  templateUrl: './new-badge.component.html',
  styleUrls: ['./new-badge.component.scss'],
})
export class NewBadgeComponent implements OnInit {

  threshold = 15 * 60 * 1000;

  @Input() time;

  show = false;

  constructor() { }

  ngOnInit() {
    this.show = (new Date()).getTime() - this.time < this.threshold;
  }

}
