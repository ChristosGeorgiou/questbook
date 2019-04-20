import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { StateService } from './services/state.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public appPages = [{
    title: 'Quests',
    url: '/quests',
    icon: 'paper'
  }, {
    title: 'Characters',
    url: '/home/character',
    icon: 'contacts'
  }, {
    title: 'Monsters',
    url: '/home/monster',
    icon: 'trophy'
  }, {
    title: 'Items',
    url: '/home/item',
    icon: 'rose'
  }, {
    title: 'Maps',
    url: '/home/map',
    icon: 'map'
  }, {
    title: 'List',
    url: '/list',
    icon: 'list'
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
