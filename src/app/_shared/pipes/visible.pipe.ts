import { Pipe, PipeTransform } from '@angular/core';
import { CampaignDocData } from '../services/models.all';
import { StateService } from '../services/state.service';
@Pipe({
  name: 'visible',
  pure: false
})
export class VisiblePipe implements PipeTransform {
  constructor(private state: StateService) { }
  transform(items: CampaignDocData[]): any {
    if (!items) {
      return items;
    }
    return items.filter(item => item.visible || this.state.campaign$.value.isMaster);
  }
}
