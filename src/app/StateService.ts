import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class StateService {
  isMaster: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}
