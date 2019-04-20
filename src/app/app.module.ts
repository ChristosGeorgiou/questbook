import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { MarkdownModule } from 'ngx-markdown';
import { WebStorageModule } from 'ngx-store';
import { AppComponent } from './app.component';
import { ClickStopPropagation } from './directives/click-stop-propagation.directive';
import { NewBadgeComponent } from './new-badge/new-badge.component';
import { QuestCardComponent } from './quests/quest-card/quest-card.component';
import { QuestModalComponent } from './quests/quest-modal/quest-modal.component';
import { QuestsComponent } from './quests/quests.component';
import { StateService } from './services/state.service';
import { StoryComponent } from './story/story.component';

@NgModule({
  declarations: [
    AppComponent,
    NewBadgeComponent,
    StoryComponent,
    QuestsComponent,
    QuestModalComponent,
    QuestCardComponent,

    ClickStopPropagation,
  ],
  entryComponents: [
    QuestModalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    WebStorageModule,
    MarkdownModule.forRoot(),
    IonicModule.forRoot(),
    RouterModule.forRoot([{
      path: '',
      redirectTo: 'home',
      pathMatch: 'full'
    }, {
      path: 'quests',
      component: QuestsComponent
    }])
  ],
  providers: [
    StatusBar,
    SplashScreen,
    StateService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
