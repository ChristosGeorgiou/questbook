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
import { CampaignComponent } from './campaign/campaign.component';
import { CharacterCardComponent } from './characters/character-card/character-card.component';
import { CharacterFormComponent } from './characters/character-form/character-form.component';
import { CharactersComponent } from './characters/characters.component';
import { EnemyComponent } from './enemy/enemy.component';
import { HomeComponent } from './home/home.component';
import { PrefsComponent } from './prefs/prefs.component';
import { QuestCardComponent } from './quests/quest-card/quest-card.component';
import { QuestFormComponent } from './quests/quest-form/quest-form.component';
import { QuestsComponent } from './quests/quests.component';
import { SearchComponent } from './search/search.component';
import { FooterComponent } from './_shared/components/footer/footer.component';
import { ClickStopPropagation } from './_shared/directives/click-stop-propagation.directive';
import { NewBadgeComponent } from './_shared/new-badge/new-badge.component';
import { HighlightPipe } from './_shared/pipes/highlight.pipe';
import { VisiblePipe } from './_shared/pipes/visible.pipe';
import { DatabaseService } from './_shared/services/database.service';
import { StateService } from './_shared/services/state.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    NewBadgeComponent,
    QuestsComponent,
    QuestFormComponent,
    QuestCardComponent,
    SearchComponent,
    CharactersComponent,
    CharacterCardComponent,
    ClickStopPropagation,
    CampaignComponent,
    HomeComponent,
    HighlightPipe,
    EnemyComponent,
    PrefsComponent,
    FooterComponent,
    CharacterFormComponent,

    VisiblePipe,
  ],
  entryComponents: [
    CharacterFormComponent,
    QuestFormComponent,
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
      path: 'home',
      component: HomeComponent
    }, {
      path: 'search',
      component: SearchComponent
    }, {
      path: 'campaign',
      component: CampaignComponent,
      children: [{
        path: '',
        redirectTo: 'quests',
        pathMatch: 'full'
      }, {
        path: 'enemy',
        component: EnemyComponent
      }, {
        path: 'characters',
        component: CharactersComponent
      }, {
        path: 'quests',
        component: QuestsComponent
      }, {
        path: 'prefs',
        component: PrefsComponent
      }]
    }]),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    StateService,
    DatabaseService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
