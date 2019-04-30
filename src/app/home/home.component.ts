import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
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

  ngOnInit() { }

  join(campaign) {
    this.state.loadCampaign(campaign);
    this.navController.navigateForward('/campaign');
  }

  create() {
  }
}
