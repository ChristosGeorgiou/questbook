import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MarkdownModule } from 'ngx-markdown';
import { DatabaseService } from '../services/database.service';
import { HomePage } from './home.page';
import { ItemComponent } from './item/item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // LMarkdownEditorModule,
    MarkdownModule.forChild(),
    RouterModule.forChild([
      {
        path: ':t',
        component: HomePage
      }
    ])
  ],
  declarations: [
    HomePage,
    ItemComponent,
  ],
  entryComponents: [ItemComponent],
  providers: [
    DatabaseService
  ]
})
export class HomePageModule {}
