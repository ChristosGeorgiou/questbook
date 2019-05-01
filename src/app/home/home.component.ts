import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { StateService } from '../_shared/services/state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  createCampaign: string;
  joinedCampaigns: string[];

  constructor(
    private state: StateService,
    private navController: NavController
  ) { }

  get versions() {
    return environment.versions;
  }
  
  ngOnInit() { }

  join(campaign) {
    this.state.loadCampaign(campaign);
    this.navController.navigateForward('/campaign');
  }

  create() {
  }
}
