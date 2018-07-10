import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DiaryAddComponent } from './diaryadd/diaryadd.component'
import { DiaryListComponent } from './diarylist/diarylist.component'
import { CommonService } from './common/common.service'

@NgModule({
  declarations: [
    AppComponent,
    DiaryAddComponent,
    DiaryListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [CommonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
