import { Injectable } from '@angular/core';
import { LocalStorage } from 'ngx-store';

@Injectable()
export class StateService {

  @LocalStorage() campaign;
  @LocalStorage() isMaster = false;

  constructor() {}
}
