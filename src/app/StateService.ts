import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class StateService {
  campaign = 'campaign01';
  isMaster: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}
