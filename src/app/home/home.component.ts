import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../_shared/services/state.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  campaigns = [
    { title: 'my first hellish campaign', alias: 'first', created: 2000000, creator: 'soula' },
    { title: 'between heaven and hell', alias: 'heavenhell', created: 40000000, creator: 'christos' },
  ];
  term = 'hell';
  campaignName;
  results;

  constructor(
    private state: StateService,
    private router: Router
  ) { }

  ngOnInit() { }

  search() {
    this.results = this.campaigns.filter(c => c.title.toUpperCase().indexOf(this.term.toUpperCase()) !== -1);
  }

  join(campaign) {
    this.state.campaign = campaign.alias;
    this.state.isMaster = false;
    this.router.navigate(['/campaign']);
  }
}
