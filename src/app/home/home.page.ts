import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { StateService } from '../StateService';
import { Doc, DocType } from './example';
import { ItemComponent } from './item/item.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  items: Doc[];
  docType = DocType;
  s: boolean;
  type: DocType;
  title: string;
  typeTitles = {
    story: 'Stories',
    character: 'Characters',
    monster: 'Monsters',
    item: 'Items',
    map: 'Maps'
  };
  constructor(
    private db: DatabaseService,
    private state: StateService,
    private actionSheetController: ActionSheetController,
    private route: ActivatedRoute,
    private router: Router,
    private modalController: ModalController
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log('params', params);
      this.type = params['t'];
      console.log(this.type);
      this.title = this.typeTitles[this.type];
      this.db.get().then(db => {
        db['tabletop'].$.subscribe(async (s) => {
          this.getData(db);
        });
        this.state.isMaster.subscribe((s) => {
          this.s = s;
          this.getData(db);
        });
        this.getData(db);
        this.newItem()
      });
    });
  }

  async getData(db) {
    const items: Doc[] = await db['tabletop'].find().where('type').eq(DocType[this.type]).exec();
    console.log('items', items);
    this.items = items
      .filter(x => x.show || this.state.isMaster.value)
      .sort((x, y) => y.ts - x.ts);
  }

  async presentActionSheet(item: Doc) {
    const actionSheet = await this.actionSheetController.create({
      // header: 'Albums',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'Edit',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async newItem() {
    console.log('new items');
    const modal = await this.modalController.create({
      component: ItemComponent,
      // componentProps: {
      //   'prop1': value,
      //   'prop2': value2
      // }
    });
    return await modal.present();
  }
}
