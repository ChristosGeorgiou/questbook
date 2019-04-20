import { Injectable } from '@angular/core';
import { LocalStorage } from 'ngx-store';

@Injectable()
export class StateService {

  campaign = 'campaign01';

  @LocalStorage() isMaster = false;

  constructor() {
  }
}
