import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { StateService } from '../_shared/services/state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {

  campaigns: string[];

  constructor(
    private state: StateService,
    private navController: NavController,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.campaigns = Object.keys(this.state.campaigns);
  }

  open(campaign) {
    this.state.loadCampaign(campaign);
    this.navController.navigateForward('/campaign');
  }

  create() {
    return this.http.post(`${environment.funcs}/create-campaign`, {}).toPromise();
  }
}
