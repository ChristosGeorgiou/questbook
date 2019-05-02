import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Campaign, Preferences } from '../_shared/services/models.all';
import { StateService } from '../_shared/services/state.service';

@Component({
  selector: 'app-campaign',
  templateUrl: 'campaign.component.html'
})
export class CampaignComponent implements OnInit {

  appPages = [{
    title: 'Quests',
    url: '/campaign/quests',
    icon: 'paper'
    // }, {
    //   title: 'Characters',
    //   url: '/campaign/character',
    //   icon: 'contacts'
    // }, {
    //   title: 'Monsters',
    //   url: '/campaign/monster',
    //   icon: 'trophy'
    // }, {
    //   title: 'Items',
    //   url: '/campaign/item',
    //   icon: 'rose'
    // }, {
    //   title: 'Maps',
    //   url: '/campaign/map',
    //   icon: 'map'
  }];

  campaign$: Observable<Campaign & Preferences>;

  constructor(
    private state: StateService,
    private navController: NavController
  ) {
  }

  get versions() {
    return environment.versions;
  }

  ngOnInit(): void {
    if (!this.state.last) {
      this.navController.navigateRoot('/home');
      return;
    }
    this.campaign$ = this.state.campaign$;
    if (!this.state.active$.value) {
      this.state.activate(this.state.last);
    }
  }
}
