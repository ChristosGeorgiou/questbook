import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { StateService } from '../_shared/services/state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  joinCampaign = 'testcampaign';
  createCampaign: string;

  constructor(
    private state: StateService,
    private navController: NavController
  ) { }

  ngOnInit() { }

  join() {
    this.state.setCampaign(this.joinCampaign);
    this.state.isMaster = false;
    this.navController.navigateRoot('/campaign');
  }

  create() {
  }
}
