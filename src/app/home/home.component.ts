import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { StateService } from '../_shared/services/state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  campaigns: string[];

  constructor(
    private state: StateService,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.campaigns = Object.keys(this.state.campaigns);
  }

  open(campaign) {
    this.state.loadCampaign(campaign);
    this.navController.navigateForward('/campaign');
  }

  create(name:string) {
  }
}
