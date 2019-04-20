import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { StateService } from '../services/state.service';
import { Quest } from './models/quest';
import { QuestModalComponent } from './quest-modal/quest-modal.component';

@Component({
  selector: 'app-quests',
  templateUrl: './quests.component.html',
})
export class QuestsComponent implements OnInit {

  quests: Quest[] = [{
    subject: 'Find the secret city',
    description: 'Where is the secret sity',
    visible: 1555753513000,
    items: [{
      content: 'The city is under the sun',
      visible: 1555753513000,
    }, {
      content: 'The one that has no name knows how to find it',
      visible: null,
    }, {
      content: 'The blue dragon has destroy the city before',
      visible: 1555753513000,
    }]
  }, {
    subject: 'Find who stole the amber staff',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse hendrerit purus id nulla dignissim vulputate. Cras mattis et justo quis placerat. Fusce ut elementum augue. Donec convallis nisl non efficitur consequat. Morbi pulvinar mi vel orci maximus rutrum. Cras dapibus augue eu tellus pulvinar, dapibus fringilla metus eleifend. In in laoreet est. Mauris vel sodales nunc.',
    visible: 1555749333000,
    items: [{
      content: 'Lorem is the brother of ipsum',
      visible: 1555749373000,
    }, {
      content: 'Ispum is missing',
      visible: 1555749552000,
    }]
  }];

  constructor(
    private state: StateService,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController
  ) { }

  get isMaster() {
    return this.state.isMaster;
  }

  ngOnInit() { }

  async newQuest() {
      const modal = await this.modalController.create({
        component: QuestModalComponent,
        // componentProps: {
        //   'prop1': value,
        //   'prop2': value2
        // }
      });
      return await modal.present();
    }

  async presentActionSheet(quest: Quest) {
    if (!this.isMaster) { return; }
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Show', icon: 'eye', handler: () => { this.showQuest(quest); }
      }, {
        text: 'Hide', icon: 'eye-off', handler: () => { this.hideQuest(quest); }
      }, {
        text: 'Delete', icon: 'trash', handler: () => { console.log('Delete clicked'); }
      }, {
        text: 'Edit', icon: 'share', handler: () => { console.log('Share clicked'); }
      }, {
        text: 'Cancel', icon: 'close', role: 'cancel', handler: () => { console.log('Cancel clicked'); }
      }]
    });
    await actionSheet.present();
  }

  showQuest(quest) {
    quest.visible = Date.now();
    this.quests.sort((a, b) => {
      return b.visible - a.visible;
    });
  }

  hideQuest(quest) {
    quest.visible = null;
  }

}
