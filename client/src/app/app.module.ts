import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DiaryAddComponent } from './diaryadd/diaryadd.component'
import { DiaryListComponent } from './diarylist/diarylist.component'
import { CommonService } from './common/common.service'
import { MDBBootstrapModule } from 'angular-bootstrap-md';

@NgModule({
  declarations: [
    AppComponent,
    DiaryAddComponent,
    DiaryListComponent,
    FileSelectDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot()
  ],
  schemas: [  ],
  providers: [CommonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
