import { Injectable } from '@angular/core';
import { LocalStorage } from 'ngx-store';
import { Subject } from 'rxjs';

@Injectable()
export class StateService {

  @LocalStorage() campaign = '';
  @LocalStorage() isMaster = false;

  activeCampaign: Subject<string> = new Subject<string>();

  constructor() {  }

  setCampaign(campaign: string) {
    this.campaign = campaign;
    this.activeCampaign.next(this.campaign);
  }
}
