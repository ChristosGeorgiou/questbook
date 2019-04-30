import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Campaign, Preferences } from '../_shared/services/models.all';
import { StateService } from '../_shared/services/state.service';

@Component({
  selector: 'app-prefs',
  templateUrl: './prefs.component.html',
  styleUrls: ['./prefs.component.scss'],
})
export class PrefsComponent implements OnInit {
  campaign$: Observable<Campaign & Preferences>;

  constructor(
    private state: StateService,
  ) { }

  ngOnInit() {
    this.campaign$ = this.state.campaign$;
  }

  update($ev) {
    this.state.updatePrefs({
      isMaster: $ev.detail.checked
    });
  }
}
