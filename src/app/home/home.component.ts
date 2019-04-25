import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private router: Router
  ) { }

  ngOnInit() { }

  join() {
    this.state.campaign = this.joinCampaign;
    this.state.isMaster = false;
    this.router.navigate(['/campaign']);
  }

  create() {
  }
}
