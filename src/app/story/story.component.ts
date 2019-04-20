import { Component, Input, OnInit } from '@angular/core';
import { Quest } from '../services/models.all';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
})
export class StoryComponent implements OnInit {

  @Input() story: Quest;

  constructor() { }

  ngOnInit() {}

}
