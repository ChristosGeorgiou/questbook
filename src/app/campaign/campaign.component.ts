import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { StateService } from '../_shared/services/state.service';

@Component({
  selector: 'app-campaign',
  templateUrl: 'campaign.component.html'
})
export class CampaignComponent {

  public appPages = [{
    title: 'Quests',
    url: '/campaign/quests',
    icon: 'paper'
  }, {
    title: 'Characters',
    url: '/campaign/character',
    icon: 'contacts'
  }, {
    title: 'Monsters',
    url: '/campaign/monster',
    icon: 'trophy'
  }, {
    title: 'Items',
    url: '/campaign/item',
    icon: 'rose'
  }, {
    title: 'Maps',
    url: '/campaign/map',
    icon: 'map'
  }];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private state: StateService,
  ) {
    this.initializeApp();
  }

  get isMaster() {
    return this.state.isMaster;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  switchMaster() {
    this.state.isMaster = !this.state.isMaster;
  }
}
