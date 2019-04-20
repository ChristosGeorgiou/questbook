import { Injectable } from '@angular/core';
import { LocalStorage } from 'ngx-store';

@Injectable()
export class StateService {

  campaign = 'first';

  @LocalStorage() isMaster = false;

  constructor() {
  }
}
