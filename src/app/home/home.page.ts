import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { StateService } from '../StateService';
import { Doc, DocType } from './example';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  items: Doc[];
  docType = DocType;
  s: boolean;

  constructor(
    private db: DatabaseService,
    private state: StateService
  ) { }

  ngOnInit(): void {
    this.db.get().then(db => {
      db['tabletop'].$.subscribe(async (s) => {
        this.getData(db);
      });
      this.state.isMaster.subscribe((s) => {
        this.s = s;
        this.getData(db);
      });
      this.getData(db);
    });
  }

  async getData(db) {
    const items: Doc[] = await db['tabletop'].find().exec();
    console.log(items);
    this.items = items
      .filter(x => x.show || this.state.isMaster.value)
      .sort((x, y) => y.ts - x.ts);
  }
}
