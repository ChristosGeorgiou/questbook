import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
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
    private state: StateService,
    private navController: NavController
  ) {
  }

  get isMaster() {
    return this.state.isMaster;
  }

  get campaign() {
    return this.state.campaign;
  }

  switchMaster() {
    this.state.isMaster = !this.state.isMaster;
  }

  switchCampaign() {
    this.navController.navigateRoot('/home');
  }
}
