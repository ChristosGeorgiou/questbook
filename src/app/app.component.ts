import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { StateService } from './StateService';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  isMaster = false;

  public appPages = [{
    title: 'Stories',
    url: '/home/story',
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

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();

      this.isMaster = this.state.isMaster.value;

      this.splashScreen.hide();
    });
  }

  switchMaster() {
    this.isMaster = !this.isMaster;
    this.state.isMaster.next(this.isMaster);
  }
}
